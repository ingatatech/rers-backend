import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../../common/database/database.service';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { UpdateInstitutionDto } from './dto/update-institution.dto';

@Injectable()
export class InstitutionsService {
  constructor(private readonly database: DatabaseService) {}

  // ─── create ──────────────────────────────────────────────────────────────────

  async create(dto: CreateInstitutionDto) {
    const existing = await this.database.institution.findUnique({
      where: { code: dto.code },
    });

    if (existing) {
      throw new ConflictException(
        `An institution with code "${dto.code}" already exists.`,
      );
    }

    const tenant = await this.database.tenant.findUnique({
      where: { id: dto.tenantId },
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant with id "${dto.tenantId}" not found.`);
    }

    return this.database.institution.create({
      data: {
        name: dto.name,
        code: dto.code,
        type: dto.type,
        tenantId: dto.tenantId,
        address: dto.address,
        phone: dto.phone,
        email: dto.email,
        isActive: dto.isActive ?? true,
      },
      include: { tenant: { select: { id: true, name: true, code: true } } },
    });
  }

  // ─── findAll ─────────────────────────────────────────────────────────────────

  async findAll(tenantId?: string, search?: string) {
    const where: Record<string, unknown> = {};

    if (tenantId) {
      where.tenantId = tenantId;
    }

    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    return this.database.institution.findMany({
      where,
      include: {
        tenant: { select: { id: true, name: true, code: true } },
        _count: { select: { applications: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  // ─── findOne ─────────────────────────────────────────────────────────────────

  async findOne(id: string) {
    const institution = await this.database.institution.findUnique({
      where: { id },
      include: {
        tenant: { select: { id: true, name: true, code: true } },
        _count: { select: { applications: true } },
      },
    });

    if (!institution) {
      throw new NotFoundException(`Institution with id "${id}" not found.`);
    }

    return institution;
  }

  // ─── findByTenant ─────────────────────────────────────────────────────────────

  async findByTenant(tenantId: string) {
    const tenant = await this.database.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant with id "${tenantId}" not found.`);
    }

    return this.database.institution.findMany({
      where: { tenantId },
      include: {
        tenant: { select: { id: true, name: true, code: true } },
        _count: { select: { applications: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  // ─── update ──────────────────────────────────────────────────────────────────

  async update(id: string, dto: UpdateInstitutionDto) {
    await this.findOne(id);

    return this.database.institution.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.type !== undefined && { type: dto.type }),
        ...(dto.address !== undefined && { address: dto.address }),
        ...(dto.phone !== undefined && { phone: dto.phone }),
        ...(dto.email !== undefined && { email: dto.email }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
      },
      include: {
        tenant: { select: { id: true, name: true, code: true } },
        _count: { select: { applications: true } },
      },
    });
  }
}
