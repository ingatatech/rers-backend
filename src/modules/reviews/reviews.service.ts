import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ApplicationStatus } from '../../common/enums';
import { DatabaseService } from '../../common/database/database.service';
import { SubmitReviewDto } from './dto/submit-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly database: DatabaseService) {}

  private async findReviewById(id: string) {
    return this.database.review.findUnique({
      where: { id },
      include: this.defaultInclude(),
    });
  }

  private async openReviewFromAssignmentId(
    assignmentId: string,
    reviewerId: string,
    missingEntityLabel: 'Review' | 'Assignment' = 'Review',
  ) {
    const assignment = await this.database.reviewAssignment.findUnique({
      where: { id: assignmentId },
    });

    if (!assignment) {
      throw new NotFoundException(
        `${missingEntityLabel} "${assignmentId}" not found.`,
      );
    }

    if (assignment.reviewerId !== reviewerId) {
      throw new ForbiddenException('You do not have access to this review.');
    }

    const existingReview = await this.database.review.findFirst({
      where: {
        applicationId: assignment.applicationId,
        reviewerId: assignment.reviewerId,
      },
      include: this.defaultInclude(),
    });

    if (existingReview) {
      return existingReview;
    }

    if (!assignment.isActive) {
      throw new BadRequestException('This assignment is no longer active.');
    }

    if (assignment.conflictDeclared) {
      throw new BadRequestException(
        'You cannot open a review for an assignment with a declared conflict.',
      );
    }

    return this.database.review.create({
      data: {
        applicationId: assignment.applicationId,
        reviewerId: assignment.reviewerId,
      },
      include: this.defaultInclude(),
    });
  }

  // ─── startReview ─────────────────────────────────────────────────────────────

  async startReview(applicationId: string, reviewerId: string) {
    const application = await this.database.application.findUnique({
      where: { id: applicationId },
      select: { id: true, status: true },
    });

    if (!application) {
      throw new NotFoundException(`Application "${applicationId}" not found.`);
    }

    // Verify reviewer has an active assignment for this application
    const assignment = await this.database.reviewAssignment.findFirst({
      where: {
        applicationId,
        reviewerId,
        isActive: true,
        conflictDeclared: false,
      },
    });

    if (!assignment) {
      throw new ForbiddenException(
        'You do not have an active assignment for this application.',
      );
    }

    // Check if review already exists
    const existing = await this.database.review.findFirst({
      where: { applicationId, reviewerId },
    });

    if (existing) {
      throw new BadRequestException(
        'You have already started a review for this application.',
      );
    }

    return this.database.review.create({
      data: {
        applicationId,
        reviewerId,
      },
      include: this.defaultInclude(),
    });
  }

  async openReviewForAssignment(assignmentId: string, reviewerId: string) {
    return this.openReviewFromAssignmentId(
      assignmentId,
      reviewerId,
      'Assignment',
    );
  }

  // ─── submitReview ────────────────────────────────────────────────────────────

  async submitReview(
    reviewId: string,
    reviewerId: string,
    dto: SubmitReviewDto,
  ) {
    const directReview = await this.database.review.findUnique({
      where: { id: reviewId },
    });

    const review =
      directReview ??
      (await this.openReviewFromAssignmentId(reviewId, reviewerId));

    if (review.reviewerId !== reviewerId) {
      throw new ForbiddenException('You can only submit your own reviews.');
    }

    if (review.isComplete) {
      throw new BadRequestException('This review has already been submitted.');
    }

    const updatedReview = await this.database.review.update({
      where: { id: review.id },
      data: {
        comments: dto.comments,
        recommendation: dto.recommendation,
        conditions: dto.conditions,
        isComplete: true,
        completedAt: new Date(),
      },
      include: this.defaultInclude(),
    });

    const [application, assignments, completedReviews] = await Promise.all([
      this.database.application.findUnique({
        where: { id: review.applicationId },
        select: { status: true },
      }),
      this.database.reviewAssignment.findMany({
        where: {
          applicationId: review.applicationId,
          isActive: true,
          conflictDeclared: false,
        },
      }),
      this.database.review.findMany({
        where: {
          applicationId: review.applicationId,
          isComplete: true,
        },
        select: { reviewerId: true },
      }),
    ]);

    const completedReviewerIds = new Set(completedReviews.map((entry) => entry.reviewerId));
    const allActiveAssignmentsCompleted =
      assignments.length > 0
      && assignments.every((assignment) => completedReviewerIds.has(assignment.reviewerId));

    if (
      application?.status === ApplicationStatus.UNDER_REVIEW
      && allActiveAssignmentsCompleted
    ) {
      await this.database.application.update({
        where: { id: review.applicationId },
        data: { status: ApplicationStatus.DECISION_PENDING },
      });

      await this.database.workflowTransition.create({
        data: {
          applicationId: review.applicationId,
          fromStatus: ApplicationStatus.UNDER_REVIEW,
          toStatus: ApplicationStatus.DECISION_PENDING,
          actorId: reviewerId,
          reason: 'All assigned reviewers submitted their reviews',
        },
      });
    }

    return updatedReview;
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

    return this.database.review.findMany({
      where: { applicationId },
      include: this.defaultInclude(),
      orderBy: { createdAt: 'desc' },
    });
  }

  // ─── findByReviewer ──────────────────────────────────────────────────────────

  async findByReviewer(reviewerId: string) {
    return this.database.review.findMany({
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

  async findAssignmentsForReviewer(reviewerId: string) {
    return this.database.reviewAssignment.findMany({
      where: {
        reviewerId,
        isActive: true,
      },
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

  // ─── findOne ─────────────────────────────────────────────────────────────────

  async findOne(id: string, reviewerId: string) {
    const review = await this.findReviewById(id);

    if (review) {
      if (review.reviewerId !== reviewerId) {
        throw new ForbiddenException('You do not have access to this review.');
      }

      return review;
    }

    return this.openReviewFromAssignmentId(id, reviewerId);
  }

  // ─── defaultInclude ──────────────────────────────────────────────────────────

  private defaultInclude() {
    return {
      reviewer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      application: {
        select: {
          id: true,
          referenceNumber: true,
          title: true,
          type: true,
          status: true,
        },
      },
    };
  }
}
