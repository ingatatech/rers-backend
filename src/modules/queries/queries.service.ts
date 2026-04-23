import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ApplicationStatus } from '../../common/enums';
import { DatabaseService } from '../../common/database/database.service';
import { CreateQueryDto } from './dto/create-query.dto';
import { RespondQueryDto } from './dto/respond-query.dto';

@Injectable()
export class QueriesService {
  constructor(private readonly database: DatabaseService) {}

  // ─── raiseQuery ───────────────────────────────────────────────────────────────

  async raiseQuery(applicationId: string, adminId: string, dto: CreateQueryDto) {
    const application = await this.database.application.findUnique({
      where: { id: applicationId },
      select: { id: true, status: true },
    });

    if (!application) {
      throw new NotFoundException(
        `Application with id "${applicationId}" not found.`,
      );
    }

    const query = await this.database.query.create({
      data: {
        applicationId,
        raisedById: adminId,
        question: dto.question,
      },
      include: { responses: true },
    });

    // Update application status to QUERY_RAISED if not already
    if (application.status !== ApplicationStatus.QUERY_RAISED) {
      await this.database.application.update({
        where: { id: applicationId },
        data: { status: ApplicationStatus.QUERY_RAISED },
      });

      await this.database.workflowTransition.create({
        data: {
          applicationId,
          fromStatus: application.status,
          toStatus: ApplicationStatus.QUERY_RAISED,
          actorId: adminId,
          reason: 'Query raised by admin',
        },
      });
    }

    return query;
  }

  // ─── findByApplication ────────────────────────────────────────────────────────

  async findByApplication(applicationId: string) {
    const application = await this.database.application.findUnique({
      where: { id: applicationId },
      select: { id: true },
    });

    if (!application) {
      throw new NotFoundException(
        `Application with id "${applicationId}" not found.`,
      );
    }

    return this.database.query.findMany({
      where: { applicationId },
      include: {
        raisedBy: { select: { id: true, firstName: true, lastName: true } },
        responses: {
          orderBy: { createdAt: 'asc' },
          include: {
            responder: { select: { id: true, firstName: true, lastName: true } },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  // ─── respondToQuery ───────────────────────────────────────────────────────────

  async respondToQuery(
    applicationId: string,
    queryId: string,
    userId: string,
    dto: RespondQueryDto,
  ) {
    const query = await this.database.query.findFirst({
      where: { id: queryId, applicationId },
    });

    if (!query) {
      throw new NotFoundException(
        `Query with id "${queryId}" not found on application "${applicationId}".`,
      );
    }

    if (query.isResolved) {
      throw new BadRequestException(
        `Query "${queryId}" is already resolved and cannot receive new responses.`,
      );
    }

    const response = await this.database.queryResponse.create({
      data: {
        queryId,
        responderId: userId,
        response: dto.response,
      },
    });

    // Update the application status to RESPONSE_RECEIVED
    const application = await this.database.application.findUnique({
      where: { id: applicationId },
      select: { status: true },
    });

    if (application && application.status === ApplicationStatus.QUERY_RAISED) {
      await this.database.application.update({
        where: { id: applicationId },
        data: { status: ApplicationStatus.RESPONSE_RECEIVED },
      });

      await this.database.workflowTransition.create({
        data: {
          applicationId,
          fromStatus: ApplicationStatus.QUERY_RAISED,
          toStatus: ApplicationStatus.RESPONSE_RECEIVED,
          actorId: userId,
          reason: 'Response submitted by applicant',
        },
      });
    }

    return response;
  }

  // ─── resolveQuery ─────────────────────────────────────────────────────────────

  async resolveQuery(applicationId: string, queryId: string) {
    const query = await this.database.query.findFirst({
      where: { id: queryId, applicationId },
    });

    if (!query) {
      throw new NotFoundException(
        `Query with id "${queryId}" not found on application "${applicationId}".`,
      );
    }

    if (query.isResolved) {
      throw new BadRequestException(
        `Query "${queryId}" is already resolved.`,
      );
    }

    return this.database.query.update({
      where: { id: queryId },
      data: { isResolved: true, resolvedAt: new Date() },
      include: { responses: { orderBy: { createdAt: 'asc' } } },
    });
  }
}
