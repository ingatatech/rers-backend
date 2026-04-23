import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ApplicationStatus } from '../../common/enums';
import { UserRole } from '../../common/enums/user-role.enum';
import { DatabaseService } from '../../common/database/database.service';
import { WorkflowsService } from '../workflows/workflows.service';
import { AdvanceStatusDto } from './dto/advance-status.dto';
import { CreateApplicationDto } from './dto/create-application.dto';
import { QueryApplicationsDto } from './dto/query-applications.dto';
import { ScreenApplicationDto, ScreeningAction } from './dto/screen-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;
const EDITABLE_STATUSES = new Set<ApplicationStatus>([
  ApplicationStatus.DRAFT,
  ApplicationStatus.QUERY_RAISED,
]);
const TENANT_SCOPED_ROLES = new Set<UserRole>([
  UserRole.IRB_ADMIN,
  UserRole.CHAIRPERSON,
  UserRole.FINANCE_OFFICER,
]);

@Injectable()
export class ApplicationsService {
  constructor(
    private readonly database: DatabaseService,
    private readonly workflowsService: WorkflowsService,
  ) {}

  // ─── generateReferenceNumber ──────────────────────────────────────────────────

  private async generateReferenceNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `RNEC-${year}-`;

    // Count existing applications with a referenceNumber for this year
    const count = await this.database.application.count({
      where: { referenceNumber: { startsWith: prefix } },
    });

    const sequence = String(count + 1).padStart(4, '0');
    return `${prefix}${sequence}`;
  }

  // ─── create ──────────────────────────────────────────────────────────────────

  async create(userId: string, userTenantId: string | null, dto: CreateApplicationDto) {
    const application = await this.database.application.create({
      data: {
        title: dto.title,
        type: dto.type,
        status: ApplicationStatus.DRAFT,
        tenantId: dto.tenantId ?? userTenantId,
        applicantId: userId,
        destinationId: dto.destinationId,
        principalInvestigator: dto.principalInvestigator,
        coInvestigators: dto.coInvestigators ?? [],
        studyDuration: dto.studyDuration,
        studyStartDate: dto.studyStartDate ? new Date(dto.studyStartDate) : undefined,
        studyEndDate: dto.studyEndDate ? new Date(dto.studyEndDate) : undefined,
        population: dto.population,
        sampleSize: dto.sampleSize,
        methodology: dto.methodology,
        fundingSource: dto.fundingSource,
        budget: dto.budget,
        ethicsStatement: dto.ethicsStatement,
        consentDescription: dto.consentDescription,
        formData: dto.formData ?? undefined,
      },
      include: this.defaultInclude(),
    });

    // Record initial DRAFT workflow transition (no fromStatus)
    await this.database.workflowTransition.create({
      data: {
        applicationId: application.id,
        fromStatus: undefined,
        toStatus: ApplicationStatus.DRAFT,
        actorId: userId,
        reason: 'Application created',
      },
    });

    return application;
  }

  // ─── findAll ─────────────────────────────────────────────────────────────────

  async findAll(
    userId: string,
    role: UserRole,
    userTenantId: string | null,
    filters: QueryApplicationsDto,
  ) {
    const page = Math.max(1, parseInt(filters.page ?? '1', 10) || DEFAULT_PAGE);
    const requestedPageSize = filters.pageSize ?? filters.limit ?? '20';
    const pageSize = Math.min(
      MAX_PAGE_SIZE,
      Math.max(1, parseInt(requestedPageSize, 10) || DEFAULT_PAGE_SIZE),
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: Record<string, any> = {};

    // Role-scoped filtering
    if (role === UserRole.APPLICANT) {
      where.applicantId = userId;
    } else if (TENANT_SCOPED_ROLES.has(role)) {
      where.tenantId = userTenantId ?? undefined;
    }
    // RNEC_ADMIN and SYSTEM_ADMIN see all unless an explicit tenant filter is applied

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.type) {
      where.type = filters.type;
    }

    // RNEC_ADMIN / SYSTEM_ADMIN may additionally filter by tenantId
    if (
      filters.tenantId &&
      (role === UserRole.RNEC_ADMIN || role === UserRole.SYSTEM_ADMIN)
    ) {
      where.tenantId = filters.tenantId;
    }

    if (filters.applicantId) {
      where.applicantId = filters.applicantId;
    }

    if (filters.search) {
      where.title = { contains: filters.search, mode: 'insensitive' };
    }

    const [applications, total] = await this.database.$transaction([
      this.database.application.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: this.defaultInclude(),
      }),
      this.database.application.count({ where }),
    ]);

    return {
      data: applications,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  // ─── findOne ─────────────────────────────────────────────────────────────────

  async findOne(id: string, userId: string, role: UserRole) {
    const application = await this.database.application.findUnique({
      where: { id },
      include: {
        ...this.defaultInclude(),
        documents: true,
        workflowTransitions: { orderBy: { createdAt: 'asc' } },
        queries: {
          include: { responses: { orderBy: { createdAt: 'asc' } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!application) {
      throw new NotFoundException(`Application with id "${id}" not found.`);
    }

    // Role-based access check
    if (
      role === UserRole.APPLICANT &&
      application.applicantId !== userId
    ) {
      throw new ForbiddenException('You do not have access to this application.');
    }

    if (role === UserRole.REVIEWER) {
      const hasAccess = await Promise.all([
        this.database.reviewAssignment.findFirst({
          where: {
            applicationId: id,
            reviewerId: userId,
          },
        }),
        this.database.review.findFirst({
          where: {
            applicationId: id,
            reviewerId: userId,
          },
        }),
      ]);

      if (!hasAccess.some(Boolean)) {
        throw new ForbiddenException(
          'You do not have access to applications that are not assigned to you.',
        );
      }
    }

    if (TENANT_SCOPED_ROLES.has(role)) {
      const user = await this.database.user.findUnique({
        where: { id: userId },
        select: { tenantId: true },
      });

      if (application.tenantId !== user?.tenantId) {
        throw new ForbiddenException(
          'You do not have access to applications outside your tenant.',
        );
      }
    }

    return application;
  }

  // ─── update ──────────────────────────────────────────────────────────────────

  async update(id: string, userId: string, dto: UpdateApplicationDto) {
    const application = await this.database.application.findUnique({
      where: { id },
      select: { id: true, status: true, applicantId: true },
    });

    if (!application) {
      throw new NotFoundException(`Application with id "${id}" not found.`);
    }

    if (!EDITABLE_STATUSES.has(application.status)) {
      throw new BadRequestException(
        `Only ${Array.from(EDITABLE_STATUSES).join(' or ')} applications can be edited. Current status: "${application.status}".`,
      );
    }

    if (application.applicantId !== userId) {
      throw new ForbiddenException('You can only edit your own applications.');
    }

    return this.database.application.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.type !== undefined && { type: dto.type }),
        ...(dto.tenantId !== undefined && { tenantId: dto.tenantId }),
        ...(dto.destinationId !== undefined && { destinationId: dto.destinationId }),
        ...(dto.principalInvestigator !== undefined && {
          principalInvestigator: dto.principalInvestigator,
        }),
        ...(dto.coInvestigators !== undefined && {
          coInvestigators: dto.coInvestigators,
        }),
        ...(dto.studyDuration !== undefined && { studyDuration: dto.studyDuration }),
        ...(dto.studyStartDate !== undefined && {
          studyStartDate: new Date(dto.studyStartDate),
        }),
        ...(dto.studyEndDate !== undefined && {
          studyEndDate: new Date(dto.studyEndDate),
        }),
        ...(dto.population !== undefined && { population: dto.population }),
        ...(dto.sampleSize !== undefined && { sampleSize: dto.sampleSize }),
        ...(dto.methodology !== undefined && { methodology: dto.methodology }),
        ...(dto.fundingSource !== undefined && { fundingSource: dto.fundingSource }),
        ...(dto.budget !== undefined && { budget: dto.budget }),
        ...(dto.ethicsStatement !== undefined && {
          ethicsStatement: dto.ethicsStatement,
        }),
        ...(dto.consentDescription !== undefined && {
          consentDescription: dto.consentDescription,
        }),
        ...(dto.formData !== undefined && { formData: dto.formData }),
      },
      include: this.defaultInclude(),
    });
  }

  // ─── submit ──────────────────────────────────────────────────────────────────

  async submit(id: string, userId: string) {
    const application = await this.database.application.findUnique({
      where: { id },
      include: { documents: true },
    });

    if (!application) {
      throw new NotFoundException(`Application with id "${id}" not found.`);
    }

    if (application.status !== ApplicationStatus.DRAFT) {
      throw new BadRequestException(
        `Only DRAFT applications can be submitted. Current status: "${application.status}".`,
      );
    }

    if (application.applicantId !== userId) {
      throw new ForbiddenException('You can only submit your own applications.');
    }

    // if (application.documents.length === 0) {
    //   throw new BadRequestException(
    //     'At least one document must be attached before submission.',
    //   );
    // }

    // Validate the transition in the state machine
    this.workflowsService.validateTransition(
      ApplicationStatus.DRAFT,
      ApplicationStatus.SUBMITTED,
    );

    const referenceNumber = await this.generateReferenceNumber();

    const updated = await this.database.application.update({
      where: { id },
      data: {
        status: ApplicationStatus.SUBMITTED,
        referenceNumber,
        submittedAt: new Date(),
      },
      include: this.defaultInclude(),
    });

    // Log the workflow transition
    await this.workflowsService.recordTransition(
      id,
      ApplicationStatus.DRAFT,
      ApplicationStatus.SUBMITTED,
      userId,
      'Application submitted by applicant',
    );

    return updated;
  }

  // ─── screen ──────────────────────────────────────────────────────────────────

  async screen(id: string, adminId: string, dto: ScreenApplicationDto) {
    const application = await this.database.application.findUnique({
      where: { id },
      select: { id: true, status: true },
    });

    if (!application) {
      throw new NotFoundException(`Application with id "${id}" not found.`);
    }

    if (application.status !== ApplicationStatus.SCREENING) {
      throw new BadRequestException(
        `Application must be in SCREENING status to be screened. Current: "${application.status}".`,
      );
    }

    let toStatus: ApplicationStatus;

    switch (dto.action) {
      case ScreeningAction.PASS:
        toStatus = ApplicationStatus.UNDER_REVIEW;
        break;
      case ScreeningAction.RAISE_QUERY:
        toStatus = ApplicationStatus.QUERY_RAISED;
        break;
      case ScreeningAction.REQUEST_PAYMENT:
        toStatus = ApplicationStatus.PAYMENT_PENDING;
        break;
      default:
        throw new BadRequestException(`Unknown screening action: "${dto.action as string}".`);
    }

    this.workflowsService.validateTransition(ApplicationStatus.SCREENING, toStatus);

    const updated = await this.database.application.update({
      where: { id },
      data: { status: toStatus },
      include: this.defaultInclude(),
    });

    await this.workflowsService.recordTransition(
      id,
      ApplicationStatus.SCREENING,
      toStatus,
      adminId,
      dto.reason,
    );

    // When raising a query via the screen flow, persist the query in the DB
    if (dto.action === ScreeningAction.RAISE_QUERY && dto.reason) {
      await this.database.query.create({
        data: {
          applicationId: id,
          raisedById: adminId,
          question: dto.reason,
        },
      });
    }

    return updated;
  }

  // ─── advanceStatus ───────────────────────────────────────────────────────────

  async advanceStatus(id: string, actorId: string, dto: AdvanceStatusDto) {
    const application = await this.database.application.findUnique({
      where: { id },
      select: { id: true, status: true },
    });

    if (!application) {
      throw new NotFoundException(`Application with id "${id}" not found.`);
    }

    // This validates and throws if invalid
    this.workflowsService.validateTransition(application.status, dto.toStatus);

    const updated = await this.database.application.update({
      where: { id },
      data: { status: dto.toStatus },
      include: this.defaultInclude(),
    });

    await this.workflowsService.recordTransition(
      id,
      application.status,
      dto.toStatus,
      actorId,
      dto.reason,
      dto.notes,
    );

    return updated;
  }

  // ─── remove ──────────────────────────────────────────────────────────────────

  async remove(id: string, userId: string) {
    const application = await this.database.application.findUnique({
      where: { id },
      select: { id: true, status: true, applicantId: true },
    });

    if (!application) {
      throw new NotFoundException(`Application with id "${id}" not found.`);
    }

    if (application.applicantId !== userId) {
      throw new ForbiddenException('You can only delete your own applications.');
    }

    if (application.status !== ApplicationStatus.DRAFT) {
      throw new BadRequestException(
        `Only DRAFT applications can be deleted. Current status: "${application.status}".`,
      );
    }

    // Delete child records first (no cascade configured on the entity)
    await this.database.applicationDocument.deleteMany({ where: { applicationId: id } });
    await this.database.workflowTransition.deleteMany({ where: { applicationId: id } });

    await this.database.application.delete({ where: { id } });
  }

  // ─── getTimeline ─────────────────────────────────────────────────────────────

  async getTimeline(id: string) {
    return this.workflowsService.getTimeline(id);
  }

  // ─── defaultInclude ──────────────────────────────────────────────────────────

  private defaultInclude() {
    return {
      tenant: { select: { id: true, name: true, code: true } },
      applicant: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      destination: { select: { id: true, name: true, code: true } },
      _count: {
        select: {
          documents: true,
          queries: true,
          reviewAssignments: true,
        },
      },
    };
  }
}
