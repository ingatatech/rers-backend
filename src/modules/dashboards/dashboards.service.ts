import { Injectable } from '@nestjs/common';
import { ApplicationStatus } from '../../common/enums';
import { UserRole } from '../../common/enums/user-role.enum';
import { DatabaseService } from '../../common/database/database.service';

@Injectable()
export class DashboardsService {
  constructor(private readonly database: DatabaseService) {}

  // ─── getSummary ───────────────────────────────────────────────────────────────

  async getSummary(role: UserRole, userId: string, tenantId?: string | null) {
    if (role === UserRole.APPLICANT) {
      return this.getApplicantDashboard(userId);
    }

    if (role === UserRole.RNEC_ADMIN || role === UserRole.SYSTEM_ADMIN) {
      return this.getRnecSummary();
    }

    // IRB_ADMIN, CHAIRPERSON, FINANCE_OFFICER — scoped to tenant
    return this.getTenantSummary(tenantId ?? undefined);
  }

  // ─── getApplicantDashboard ────────────────────────────────────────────────────

  async getApplicantDashboard(userId: string) {
    const [
      totalApplications,
      draftApplications,
      underReviewApplications,
      approvedApplications,
    ] = await this.database.$transaction([
      this.database.application.count({ where: { applicantId: userId } }),
      this.database.application.count({
        where: { applicantId: userId, status: ApplicationStatus.DRAFT },
      }),
      this.database.application.count({
        where: { applicantId: userId, status: ApplicationStatus.UNDER_REVIEW },
      }),
      this.database.application.count({
        where: { applicantId: userId, status: ApplicationStatus.APPROVED },
      }),
    ]);

    const recentApplications = await this.database.application.findMany({
      where: { applicantId: userId },
      orderBy: { updatedAt: 'desc' },
      take: 5,
      select: {
        id: true,
        referenceNumber: true,
        title: true,
        status: true,
        updatedAt: true,
      },
    });

    return {
      totalApplications,
      draftApplications,
      underReviewApplications,
      approvedApplications,
      recentApplications,
    };
  }

  // ─── getReviewerDashboard ─────────────────────────────────────────────────────

  async getReviewerDashboard(userId: string) {
    const [assignedReviews, completedReviews] = await this.database.$transaction([
      this.database.reviewAssignment.count({ where: { reviewerId: userId, isActive: true } }),
      this.database.review.count({ where: { reviewerId: userId, isComplete: true } }),
    ]);

    const recentAssignments = await this.database.reviewAssignment.findMany({
      where: { reviewerId: userId, isActive: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        application: { select: { id: true, title: true, referenceNumber: true } },
      },
    });

    return {
      assignedReviews,
      completedReviews,
      pendingReviews: Math.max(0, assignedReviews - completedReviews),
      recentAssignments: recentAssignments.map((a) => ({
        id: a.id,
        applicationId: a.applicationId,
        applicationTitle: a.application?.title ?? '',
        referenceNumber: a.application?.referenceNumber ?? '',
        deadline: a.dueDate ? new Date(a.dueDate).toISOString() : undefined,
        isComplete: !a.isActive,
      })),
    };
  }

  // ─── getApplicantSummary (alias) ──────────────────────────────────────────────

  private async getApplicantSummary(userId: string) {
    return this.getApplicantDashboard(userId);
  }

  // ─── getTenantSummary ─────────────────────────────────────────────────────────

  private async getTenantSummary(tenantId?: string) {
    const where = tenantId ? { tenantId } : {};

    const [
      totalApplications,
      pendingScreening,
      underReview,
      approved,
      conditionallyApproved,
      rejected,
      paymentPending,
      activeMonitoring,
    ] = await this.database.$transaction([
      this.database.application.count({ where }),
      this.database.application.count({
        where: { ...where, status: ApplicationStatus.SCREENING },
      }),
      this.database.application.count({
        where: { ...where, status: ApplicationStatus.UNDER_REVIEW },
      }),
      this.database.application.count({
        where: { ...where, status: ApplicationStatus.APPROVED },
      }),
      this.database.application.count({
        where: { ...where, status: ApplicationStatus.CONDITIONALLY_APPROVED },
      }),
      this.database.application.count({
        where: { ...where, status: ApplicationStatus.REJECTED },
      }),
      this.database.application.count({
        where: { ...where, status: ApplicationStatus.PAYMENT_PENDING },
      }),
      this.database.application.count({
        where: { ...where, status: ApplicationStatus.MONITORING_ACTIVE },
      }),
    ]);

    const applicationsByStatus = [
      { status: ApplicationStatus.SCREENING, count: pendingScreening },
      { status: ApplicationStatus.UNDER_REVIEW, count: underReview },
      { status: ApplicationStatus.APPROVED, count: approved },
      { status: ApplicationStatus.CONDITIONALLY_APPROVED, count: conditionallyApproved },
      { status: ApplicationStatus.REJECTED, count: rejected },
      { status: ApplicationStatus.PAYMENT_PENDING, count: paymentPending },
      { status: ApplicationStatus.MONITORING_ACTIVE, count: activeMonitoring },
    ];

    // Reviewer workload
    const reviewerWorkload = await this.database.reviewAssignment.groupBy({
      by: ['reviewerId'],
      where: { isActive: true, ...(tenantId ? { application: { tenantId } } : {}) },
      _count: { reviewerId: true },
    });

    const reviewerIds = reviewerWorkload.map((r) => r.reviewerId);
    const reviewers =
      reviewerIds.length > 0
        ? await this.database.user.findMany({
            where: { id: { in: reviewerIds } },
            select: { id: true, firstName: true, lastName: true },
          })
        : [];

    const reviewerMap = new Map(reviewers.map((r) => [r.id, r]));

    const workload = reviewerWorkload.map((r) => ({
      reviewerId: r.reviewerId,
      name: reviewerMap.has(r.reviewerId)
        ? `${reviewerMap.get(r.reviewerId)!.firstName} ${reviewerMap.get(r.reviewerId)!.lastName}`
        : 'Unknown',
      assignedCount: r._count.reviewerId,
    }));

    // Recent activity from workflow transitions
    const recentTransitions = await this.database.workflowTransition.findMany({
      where: tenantId ? { application: { tenantId } } : {},
      orderBy: { createdAt: 'desc' },
      take: 8,
      include: {
        application: { select: { id: true, referenceNumber: true, title: true } },
      },
    });

    const actorIds = [
      ...new Set(
        recentTransitions.filter((t) => t.actorId).map((t) => t.actorId as string),
      ),
    ];
    const actors =
      actorIds.length > 0
        ? await this.database.user.findMany({
            where: { id: { in: actorIds } },
            select: { id: true, firstName: true, lastName: true },
          })
        : [];
    const actorMap = new Map(actors.map((a) => [a.id, a]));

    const recentActivity = recentTransitions.map((t) => ({
      applicationId: t.applicationId,
      referenceNumber: t.application?.referenceNumber ?? 'N/A',
      action: t.toStatus as string,
      actorName:
        t.actorId && actorMap.has(t.actorId)
          ? `${actorMap.get(t.actorId)!.firstName} ${actorMap.get(t.actorId)!.lastName}`
          : 'System',
      createdAt: new Date(t.createdAt).toISOString(),
    }));

    return {
      totalApplications,
      pendingScreening,
      underReview,
      approved,
      conditionallyApproved,
      rejected,
      paymentPending,
      activeMonitoring,
      applicationsByStatus,
      recentActivity,
      reviewerWorkload: workload,
    };
  }

  // ─── getRnecSummary ───────────────────────────────────────────────────────────

  async getRnecSummary() {
    const global = await this.getTenantSummary();

    const tenants = await this.database.tenant.findMany({
      where: { isActive: true },
      select: { id: true, name: true, code: true, isActive: true },
    });

    const tenantStats = await Promise.all(
      tenants.map(async (tenant) => {
        const [total, tenantApproved, pending, tenantRejected] =
          await this.database.$transaction([
            this.database.application.count({ where: { tenantId: tenant.id } }),
            this.database.application.count({
              where: { tenantId: tenant.id, status: ApplicationStatus.APPROVED },
            }),
            this.database.application.count({
              where: { tenantId: tenant.id, status: ApplicationStatus.UNDER_REVIEW },
            }),
            this.database.application.count({
              where: { tenantId: tenant.id, status: ApplicationStatus.REJECTED },
            }),
          ]);

        return {
          tenant: {
            id: tenant.id,
            name: tenant.name,
            code: tenant.code,
            isActive: tenant.isActive,
          },
          total,
          approved: tenantApproved,
          pending,
          rejected: tenantRejected,
        };
      }),
    );

    return {
      totalApplications: global.totalApplications,
      totalApproved: global.approved,
      totalPending: global.underReview,
      totalRejected: global.rejected,
      tenantStats,
    };
  }

  // ─── getSystemAdminDashboard ──────────────────────────────────────────────────

  async getSystemAdminDashboard() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [totalUsers, totalTenants, totalRoles, recentAuditEvents] =
      await this.database.$transaction([
        this.database.user.count({}),
        this.database.tenant.count({}),
        this.database.role.count({}),
        this.database.auditLog.count({
          where: { createdAt: { gte: sevenDaysAgo } },
        }),
      ]);

    return { totalUsers, totalTenants, totalRoles, recentAuditEvents };
  }
}
