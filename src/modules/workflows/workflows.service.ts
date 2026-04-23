import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ApplicationStatus } from '../../common/enums';
import { DatabaseService } from '../../common/database/database.service';

/** Defines the allowed state machine transitions. */
const ALLOWED_TRANSITIONS: Partial<Record<ApplicationStatus, ApplicationStatus[]>> = {
  [ApplicationStatus.DRAFT]: [ApplicationStatus.SUBMITTED],
  [ApplicationStatus.SUBMITTED]: [ApplicationStatus.SCREENING],
  [ApplicationStatus.SCREENING]: [
    ApplicationStatus.PAYMENT_PENDING,
    ApplicationStatus.QUERY_RAISED,
    ApplicationStatus.UNDER_REVIEW,
  ],
  [ApplicationStatus.PAYMENT_PENDING]: [ApplicationStatus.PAYMENT_VERIFIED],
  [ApplicationStatus.PAYMENT_VERIFIED]: [ApplicationStatus.UNDER_REVIEW],
  [ApplicationStatus.QUERY_RAISED]: [ApplicationStatus.RESPONSE_RECEIVED],
  [ApplicationStatus.RESPONSE_RECEIVED]: [
    ApplicationStatus.UNDER_REVIEW,
    ApplicationStatus.SCREENING,
  ],
  [ApplicationStatus.UNDER_REVIEW]: [
    ApplicationStatus.DECISION_PENDING,
    ApplicationStatus.QUERY_RAISED,
  ],
  [ApplicationStatus.DECISION_PENDING]: [
    ApplicationStatus.APPROVED,
    ApplicationStatus.CONDITIONALLY_APPROVED,
    ApplicationStatus.REJECTED,
  ],
  [ApplicationStatus.APPROVED]: [
    ApplicationStatus.MONITORING_ACTIVE,
    ApplicationStatus.CLOSED,
    ApplicationStatus.AMENDMENT_PENDING,
  ],
  [ApplicationStatus.CONDITIONALLY_APPROVED]: [
    ApplicationStatus.MONITORING_ACTIVE,
    ApplicationStatus.AMENDMENT_PENDING,
  ],
  [ApplicationStatus.AMENDMENT_PENDING]: [ApplicationStatus.UNDER_REVIEW],
  [ApplicationStatus.MONITORING_ACTIVE]: [ApplicationStatus.CLOSED],
};

@Injectable()
export class WorkflowsService {
  constructor(private readonly database: DatabaseService) {}

  // ─── validateTransition ──────────────────────────────────────────────────────

  validateTransition(
    from: ApplicationStatus | null,
    to: ApplicationStatus,
  ): void {
    if (from === null) {
      // Initial transition (no previous status) — allowed for DRAFT only
      if (to !== ApplicationStatus.DRAFT) {
        throw new BadRequestException(
          `Initial status must be DRAFT, not "${to}".`,
        );
      }
      return;
    }

    const allowed = ALLOWED_TRANSITIONS[from] ?? [];

    if (!allowed.includes(to)) {
      throw new BadRequestException(
        `Transition from "${from}" to "${to}" is not allowed. Allowed: [${allowed.join(', ')}].`,
      );
    }
  }

  // ─── recordTransition ────────────────────────────────────────────────────────

  async recordTransition(
    applicationId: string,
    from: ApplicationStatus | null,
    to: ApplicationStatus,
    actorId: string | null,
    reason?: string,
    notes?: string,
  ) {
    this.validateTransition(from, to);

    return this.database.workflowTransition.create({
      data: {
        applicationId,
        fromStatus: from ?? undefined,
        toStatus: to,
        actorId: actorId ?? undefined,
        reason,
        notes,
      },
    });
  }

  // ─── getTimeline ─────────────────────────────────────────────────────────────

  async getTimeline(applicationId: string) {
    const application = await this.database.application.findUnique({
      where: { id: applicationId },
      select: { id: true, referenceNumber: true, status: true },
    });

    if (!application) {
      throw new NotFoundException(
        `Application with id "${applicationId}" not found.`,
      );
    }

    const transitions = await this.database.workflowTransition.findMany({
      where: { applicationId },
      orderBy: { createdAt: 'asc' },
      include: {
        application: {
          select: { id: true, referenceNumber: true },
        },
      },
    });

    return {
      application,
      timeline: transitions,
    };
  }

  // ─── getAllowedTransitions ────────────────────────────────────────────────────

  getAllowedTransitions(from: ApplicationStatus): ApplicationStatus[] {
    return ALLOWED_TRANSITIONS[from] ?? [];
  }
}
