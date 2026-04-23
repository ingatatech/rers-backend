import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ApplicationStatus, NotificationType } from '../../common/enums';
import { DatabaseService } from '../../common/database/database.service';
import { UserRole } from '../../common/enums/user-role.enum';
import { CreateAssignmentDto } from './dto/create-assignment.dto';

@Injectable()
export class ReviewerAssignmentsService {
  constructor(private readonly database: DatabaseService) {}

  // ─── assign ──────────────────────────────────────────────────────────────────

  async assign(assignedById: string, dto: CreateAssignmentDto) {
    const application = await this.database.application.findUnique({
      where: { id: dto.applicationId },
      select: { id: true, status: true, title: true, tenantId: true },
    });

    if (!application) {
      throw new NotFoundException(
        `Application "${dto.applicationId}" not found.`,
      );
    }

    const reviewer = await this.database.user.findUnique({
      where: { id: dto.reviewerId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        tenantId: true,
        role: { select: { name: true } },
      },
    });

    if (!reviewer) {
      throw new NotFoundException(`Reviewer "${dto.reviewerId}" not found.`);
    }

    if (reviewer.role.name !== UserRole.REVIEWER) {
      throw new BadRequestException('Only users with the REVIEWER role can be assigned.');
    }

    if (
      application.tenantId &&
      reviewer.tenantId &&
      application.tenantId !== reviewer.tenantId
    ) {
      throw new ForbiddenException(
        'You can only assign reviewers who belong to the same tenant as the application.',
      );
    }

    if (
      application.status !== ApplicationStatus.PAYMENT_VERIFIED
      && application.status !== ApplicationStatus.UNDER_REVIEW
      && application.status !== ApplicationStatus.DECISION_PENDING
    ) {
      throw new BadRequestException(
        `Reviewers can only be assigned after payment verification or while the application is already under review. Current status: "${application.status}".`,
      );
    }

    // Check for existing active assignment
    const existing = await this.database.reviewAssignment.findFirst({
      where: {
        applicationId: dto.applicationId,
        reviewerId: dto.reviewerId,
        isActive: true,
      },
    });

    if (existing) {
      throw new BadRequestException(
        'This reviewer is already actively assigned to this application.',
      );
    }

    const assignment = await this.database.reviewAssignment.create({
      data: {
        applicationId: dto.applicationId,
        reviewerId: dto.reviewerId,
        assignedById,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      },
      include: {
        application: { select: { id: true, title: true, referenceNumber: true } },
        reviewer: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });

    // Move application to UNDER_REVIEW if not already
    if (application.status === ApplicationStatus.PAYMENT_VERIFIED) {
      await this.database.application.update({
        where: { id: dto.applicationId },
        data: { status: ApplicationStatus.UNDER_REVIEW },
      });

      await this.database.workflowTransition.create({
        data: {
          applicationId: dto.applicationId,
          fromStatus: application.status,
          toStatus: ApplicationStatus.UNDER_REVIEW,
          actorId: assignedById,
          reason: 'Reviewer assigned — application moved to UNDER_REVIEW',
        },
      });
    }

    // Notify reviewer
    await this.database.notification.create({
      data: {
        userId: dto.reviewerId,
        type: NotificationType.REVIEWER_ASSIGNED,
        title: 'New Review Assignment',
        message: `You have been assigned to review application: ${application.title}`,
        metadata: { applicationId: dto.applicationId },
      },
    });

    return assignment;
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

    return this.database.reviewAssignment.findMany({
      where: { applicationId },
      include: {
        reviewer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ─── findByReviewer ──────────────────────────────────────────────────────────

  async findByReviewer(reviewerId: string) {
    return this.database.reviewAssignment.findMany({
      where: { reviewerId },
      include: {
        application: {
          select: {
            id: true,
            referenceNumber: true,
            title: true,
            type: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ─── declareConflict ──────────────────────────────────────────────────────────

  async declareConflict(
    assignmentId: string,
    reviewerId: string,
    reason: string,
  ) {
    const assignment = await this.database.reviewAssignment.findUnique({
      where: { id: assignmentId },
    });

    if (!assignment) {
      throw new NotFoundException(`Assignment "${assignmentId}" not found.`);
    }

    if (assignment.reviewerId !== reviewerId) {
      throw new ForbiddenException(
        'You can only declare conflict on your own assignments.',
      );
    }

    if (assignment.conflictDeclared) {
      throw new BadRequestException(
        'Conflict has already been declared for this assignment.',
      );
    }

    return this.database.reviewAssignment.update({
      where: { id: assignmentId },
      data: {
        conflictDeclared: true,
        conflictReason: reason,
        isActive: false,
      },
    });
  }

  // ─── deactivate ───────────────────────────────────────────────────────────────

  async deactivate(assignmentId: string, adminId: string) {
    const assignment = await this.database.reviewAssignment.findUnique({
      where: { id: assignmentId },
    });

    if (!assignment) {
      throw new NotFoundException(`Assignment "${assignmentId}" not found.`);
    }

    if (!assignment.isActive) {
      throw new BadRequestException('Assignment is already inactive.');
    }

    return this.database.reviewAssignment.update({
      where: { id: assignmentId },
      data: { isActive: false },
    });
  }
}
