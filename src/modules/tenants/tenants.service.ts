import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../../common/database/database.service';
import { UserRole } from '../../common/enums/user-role.enum';
import { UserProvisioningService } from '../../common/user-provisioning/user-provisioning.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { QueryTenantDto } from './dto/query-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

@Injectable()
export class TenantsService {
  constructor(
    private readonly database: DatabaseService,
    private readonly provisioning: UserProvisioningService,
  ) {}

  // ─── create ──────────────────────────────────────────────────────────────────

  async create(dto: CreateTenantDto) {
    const existing = await this.database.tenant.findUnique({
      where: { code: dto.code },
    });

    if (existing) {
      throw new ConflictException(
        `A tenant with code "${dto.code}" already exists.`,
      );
    }

    const existingAdminUser = await this.database.user.findUnique({
      where: { email: dto.admin.email },
    });

    if (existingAdminUser) {
      throw new ConflictException(
        `A user with email "${dto.admin.email}" already exists.`,
      );
    }

    const irbAdminRole = await this.database.role.findUnique({
      where: { name: UserRole.IRB_ADMIN },
    });

    if (!irbAdminRole) {
      throw new BadRequestException(
        'IRB_ADMIN role has not been seeded. Run /bootstrap/seed first.',
      );
    }

    const tenant = await this.database.tenant.create({
      data: {
        name: dto.name,
        code: dto.code,
        type: dto.type,
        logoUrl: dto.logoUrl,
        address: dto.address,
        phone: dto.phone,
        email: dto.email,
        isActive: dto.isActive ?? true,
        settings: dto.settings ?? undefined,
      },
    });

    await this.provisioning.provision({
      email: dto.admin.email,
      firstName: dto.admin.firstName,
      lastName: dto.admin.lastName,
      phone: dto.admin.phone ?? null,
      roleId: irbAdminRole.id,
      tenantId: tenant.id,
    });

    return tenant;
  }

  // ─── findAll ─────────────────────────────────────────────────────────────────

  async findAll(query: QueryTenantDto) {
    const page = Math.max(1, parseInt(query.page ?? '1', 10) || DEFAULT_PAGE);
    const pageSize = Math.min(
      MAX_PAGE_SIZE,
      Math.max(1, parseInt(query.pageSize ?? '20', 10) || DEFAULT_PAGE_SIZE),
    );

    const where: Record<string, unknown> = {};

    if (query.isActive !== undefined) {
      where.isActive = query.isActive === 'true';
    }

    if (query.type) {
      where.type = query.type;
    }

    if (query.search) {
      where.name = { contains: query.search, mode: 'insensitive' };
    }

    const [tenants, total] = await this.database.$transaction([
      this.database.tenant.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { users: true, applications: true, institutions: true },
          },
        },
      }),
      this.database.tenant.count({ where }),
    ]);

    return {
      data: tenants,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  // ─── findOne ─────────────────────────────────────────────────────────────────

  async findOne(id: string) {
    const tenant = await this.database.tenant.findUnique({
      where: { id },
      include: {
        _count: {
          select: { users: true, applications: true, institutions: true },
        },
      },
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant with id "${id}" not found.`);
    }

    return tenant;
  }

  // ─── update ──────────────────────────────────────────────────────────────────

  async update(id: string, dto: UpdateTenantDto) {
    await this.findOne(id);

    return this.database.tenant.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.type !== undefined && { type: dto.type }),
        ...(dto.logoUrl !== undefined && { logoUrl: dto.logoUrl }),
        ...(dto.address !== undefined && { address: dto.address }),
        ...(dto.phone !== undefined && { phone: dto.phone }),
        ...(dto.email !== undefined && { email: dto.email }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
        ...(dto.settings !== undefined && { settings: dto.settings }),
      },
      include: {
        _count: {
          select: { users: true, applications: true, institutions: true },
        },
      },
    });
  }

  // ─── remove ──────────────────────────────────────────────────────────────────

  async remove(id: string) {
    await this.findOne(id);

    await this.database.tenant.update({
      where: { id },
      data: { isActive: false },
    });

    return { message: `Tenant "${id}" has been deactivated.` };
  }

  // ─── getTenantStats ───────────────────────────────────────────────────────────

  async getTenantStats(id: string) {
    await this.findOne(id);

    const [
      totalUsers,
      totalApplications,
      totalInstitutions,
      applicationsByStatus,
    ] = await this.database.$transaction([
      this.database.user.count({ where: { tenantId: id } }),
      this.database.application.count({ where: { tenantId: id } }),
      this.database.institution.count({ where: { tenantId: id } }),
      this.database.application.groupBy({
        by: ['status'],
        where: { tenantId: id },
        _count: { status: true },
      }),
    ]);

    return {
      tenantId: id,
      totalUsers,
      totalApplications,
      totalInstitutions,
      applicationsByStatus: applicationsByStatus.map((s) => ({
        status: s.status,
        count: s._count.status,
      })),
    };
  }
}
