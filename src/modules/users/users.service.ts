import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRole } from '../../common/enums/user-role.enum';
import { DatabaseService } from '../../common/database/database.service';
import { UserProvisioningService } from '../../common/user-provisioning/user-provisioning.service';
import { JwtPayload } from '../../common/decorators/current-user.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

const ALLOWED_CREATABLE_ROLES: Partial<Record<UserRole, UserRole[]>> = {
  [UserRole.SYSTEM_ADMIN]: [UserRole.RNEC_ADMIN],
  [UserRole.IRB_ADMIN]: [UserRole.REVIEWER, UserRole.FINANCE_OFFICER, UserRole.CHAIRPERSON],
};

export interface FindAllQuery {
  page?: number;
  pageSize?: number;
  tenantId?: string;
  role?: UserRole;
}

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

@Injectable()
export class UsersService {
  constructor(
    private readonly database: DatabaseService,
    private readonly provisioning: UserProvisioningService,
  ) {}

  // ─── createUser ──────────────────────────────────────────────────────────────

  async createUser(dto: CreateUserDto, requestingUser: JwtPayload) {
    const permitted = ALLOWED_CREATABLE_ROLES[requestingUser.role as UserRole];

    if (!permitted || !permitted.includes(dto.role)) {
      throw new ForbiddenException(
        `You are not permitted to create a user with role "${dto.role}".`,
      );
    }

    const existing = await this.database.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('A user with this email already exists.');
    }

    const role = await this.database.role.findUnique({ where: { name: dto.role } });
    if (!role) {
      throw new BadRequestException(`Role "${dto.role}" has not been seeded.`);
    }

    const tenantId =
      requestingUser.role === UserRole.IRB_ADMIN
        ? (requestingUser.tenantId ?? null)
        : null;

    return this.provisioning.provision({
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      phone: dto.phone ?? null,
      roleId: role.id,
      tenantId,
    });
  }

  // ─── findAll ─────────────────────────────────────────────────────────────────

  async findAll(query: FindAllQuery, requestingUser: JwtPayload) {
    const page = Math.max(1, query.page ?? DEFAULT_PAGE);
    const pageSize = Math.min(
      MAX_PAGE_SIZE,
      Math.max(1, query.pageSize ?? DEFAULT_PAGE_SIZE),
    );

    // IRB_ADMIN can only see users in their own tenant
    const tenantFilter: string | undefined =
      requestingUser.role === UserRole.IRB_ADMIN
        ? (requestingUser.tenantId ?? undefined)
        : (query.tenantId ?? undefined);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: Record<string, any> = {};
    if (tenantFilter) where.tenantId = tenantFilter;
    if (query.role) {
      const roleRecord = await this.database.role.findUnique({ where: { name: query.role } });
      if (roleRecord) where.roleId = roleRecord.id;
    }

    const [users, total] = await this.database.$transaction([
      this.database.user.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          isActive: true,
          isVerified: true,
          lastLoginAt: true,
          tenantId: true,
          createdAt: true,
          updatedAt: true,
          role: { select: { id: true, name: true } },
          tenant: { select: { id: true, name: true, code: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.database.user.count({ where }),
    ]);

    return {
      data: users,
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
    const user = await this.database.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        isActive: true,
        isVerified: true,
        lastLoginAt: true,
        tenantId: true,
        createdAt: true,
        updatedAt: true,
        role: { select: { id: true, name: true } },
        tenant: { select: { id: true, name: true, code: true, type: true } },
        applicantProfile: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with id "${id}" not found.`);
    }

    return user;
  }

  // ─── update ──────────────────────────────────────────────────────────────────

  async update(id: string, dto: UpdateUserDto) {
    await this.findOne(id); // ensure the user exists

    const updated = await this.database.user.update({
      where: { id },
      data: {
        ...(dto.firstName !== undefined && { firstName: dto.firstName }),
        ...(dto.lastName !== undefined && { lastName: dto.lastName }),
        ...(dto.phone !== undefined && { phone: dto.phone }),
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        isActive: true,
        isVerified: true,
        tenantId: true,
        updatedAt: true,
        role: { select: { id: true, name: true } },
      },
    });

    return updated;
  }

  // ─── updateRole ───────────────────────────────────────────────────────────────

  async updateRole(id: string, dto: UpdateRoleDto) {
    await this.findOne(id); // ensure the user exists

    const role = await this.database.role.findUnique({
      where: { name: dto.role },
    });

    if (!role) {
      throw new BadRequestException(
        `Role "${dto.role}" has not been seeded in the database.`,
      );
    }

    const updated = await this.database.user.update({
      where: { id },
      data: { roleId: role.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        updatedAt: true,
        role: { select: { id: true, name: true } },
      },
    });

    return updated;
  }

  // ─── remove ──────────────────────────────────────────────────────────────────

  async remove(id: string) {
    await this.findOne(id); // ensure the user exists

    await this.database.user.update({
      where: { id },
      data: { isActive: false },
    });

    return { message: `User "${id}" has been deactivated.` };
  }
}
