import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  ApplicationStatus,
  DecisionType,
  NotificationType,
  UserRole,
} from '../../common/enums';
import { DatabaseService } from '../../common/database/database.service';
import { CreateDecisionDto } from './dto/create-decision.dto';
import { CertificatesService } from '../certificates/certificates.service';

@Injectable()
export class DecisionsService {
  constructor(
    private readonly database: DatabaseService,
    private readonly certificatesService: CertificatesService,
  ) {}

  // ─── record ──────────────────────────────────────────────────────────────────

  async record(
    applicationId: string,
    actorId: string,
    dto: CreateDecisionDto,
  ) {
    const application = await this.database.application.findUnique({
      where: { id: applicationId },
      select: { id: true, status: true, title: true, applicantId: true, tenantId: true },
    });

    if (!application) {
      throw new NotFoundException(`Application "${applicationId}" not found.`);
    }

    const actor = await this.database.user.findUnique({
      where: { id: actorId },
      select: {
        id: true,
        tenantId: true,
        role: { select: { name: true } },
      },
    });

    if (!actor) {
      throw new NotFoundException(`User "${actorId}" not found.`);
    }

    if (actor.role.name !== UserRole.CHAIRPERSON) {
      throw new ForbiddenException(
        'Only the chairperson can record the final decision on an application.',
      );
    }

    if (application.tenantId !== actor.tenantId) {
      throw new ForbiddenException(
        'You can only record decisions for applications in your tenant.',
      );
    }

    const existingDecision = await this.database.decision.findFirst({
      where: { applicationId },
      select: { id: true },
    });

    if (existingDecision) {
      throw new BadRequestException(
        'A final decision has already been recorded for this application.',
      );
    }

    // Map decision type to application status
    const statusMap: Record<DecisionType, ApplicationStatus> = {
      [DecisionType.APPROVED]: ApplicationStatus.APPROVED,
      [DecisionType.CONDITIONALLY_APPROVED]: ApplicationStatus.CONDITIONALLY_APPROVED,
      [DecisionType.REJECTED]: ApplicationStatus.REJECTED,
      [DecisionType.DEFERRED]: ApplicationStatus.DECISION_PENDING,
    };

    const newStatus = statusMap[dto.type];

    const decision = await this.database.decision.create({
      data: {
        applicationId,
        type: dto.type,
        conditions: dto.conditions,
        rationale: dto.rationale,
        decidedById: actorId,
      },
      include: {
        application: {
          select: { id: true, referenceNumber: true, title: true },
        },
      },
    });

    // Update application status
    await this.database.application.update({
      where: { id: applicationId },
      data: { status: newStatus },
    });

    // Record workflow transition
    await this.database.workflowTransition.create({
      data: {
        applicationId,
        fromStatus: application.status,
        toStatus: newStatus,
        actorId,
        reason: `Decision issued: ${dto.type}`,
        notes: dto.rationale,
      },
    });

    // Notify applicant
    await this.database.notification.create({
      data: {
        userId: application.applicantId,
        type: NotificationType.DECISION_ISSUED,
        title: 'Decision Issued on Your Application',
        message: `A decision of "${dto.type}" has been issued for your application: ${application.title}`,
        metadata: { applicationId, decisionId: decision.id, type: dto.type },
      },
    });

    // If APPROVED, generate certificate automatically
    if (dto.type === DecisionType.APPROVED) {
      await this.certificatesService.generate(applicationId, decision.id);

      // Notify applicant about certificate
      await this.database.notification.create({
        data: {
          userId: application.applicantId,
          type: NotificationType.CERTIFICATE_AVAILABLE,
          title: 'Ethics Certificate Available',
          message: `Your ethics certificate for "${application.title}" is now available for download.`,
          metadata: { applicationId, decisionId: decision.id },
        },
      });
    }

    return decision;
  }

  // ─── findByApplication ────────────────────────────────────────────────────────

  async findByApplication(applicationId: string) {
    const application = await this.database.application.findUnique({
      where: { id: applicationId },
      select: { id: true },
    });

    if (!application) {
      throw new NotFoundException(`Application "${applicationId}" not found.`);
    }

    return this.database.decision.findMany({
      where: { applicationId },
      include: {
        certificate: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ─── findOne ─────────────────────────────────────────────────────────────────

  async findOne(id: string) {
    const decision = await this.database.decision.findUnique({
      where: { id },
      include: {
        application: {
          select: { id: true, referenceNumber: true, title: true, status: true },
        },
        certificate: true,
      },
    });

    if (!decision) {
      throw new NotFoundException(`Decision "${id}" not found.`);
    }

    return decision;
  }
}
