import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../common/database/database.service';
import { QueryAuditLogsDto } from './dto/query-audit-logs.dto';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 50;
const MAX_PAGE_SIZE = 200;

export interface CreateAuditLogDto {
  actorId?: string;
  action: string;
  targetEntity: string;
  targetId: string;
  tenantId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
}

@Injectable()
export class AuditLogsService {
  constructor(private readonly database: DatabaseService) {}

  // ─── log ─────────────────────────────────────────────────────────────────────

  async log(dto: CreateAuditLogDto) {
    return this.database.auditLog.create({
      data: {
        actorId: dto.actorId,
        action: dto.action,
        targetEntity: dto.targetEntity,
        targetId: dto.targetId,
        tenantId: dto.tenantId,
        metadata: dto.metadata ?? undefined,
        ipAddress: dto.ipAddress,
      },
    });
  }

  // ─── findAll ─────────────────────────────────────────────────────────────────

  async findAll(filters: QueryAuditLogsDto) {
    const page = Math.max(
      1,
      parseInt(filters.page ?? '1', 10) || DEFAULT_PAGE,
    );
    const pageSize = Math.min(
      MAX_PAGE_SIZE,
      Math.max(1, parseInt(filters.pageSize ?? '50', 10) || DEFAULT_PAGE_SIZE),
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: Record<string, any> = {};

    if (filters.actorId) {
      where.actorId = filters.actorId;
    }

    if (filters.action) {
      where.action = { contains: filters.action, mode: 'insensitive' };
    }

    if (filters.targetEntity) {
      where.targetEntity = { contains: filters.targetEntity, mode: 'insensitive' };
    }

    if (filters.tenantId) {
      where.tenantId = filters.tenantId;
    }

    if (filters.dateFrom || filters.dateTo) {
      where.createdAt = {};

      if (filters.dateFrom) {
        where.createdAt.gte = new Date(filters.dateFrom);
      }

      if (filters.dateTo) {
        where.createdAt.lte = new Date(filters.dateTo);
      }
    }

    const [logs, total] = await this.database.$transaction([
      this.database.auditLog.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          actor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          tenant: {
            select: { id: true, name: true, code: true },
          },
        },
      }),
      this.database.auditLog.count({ where }),
    ]);

    return {
      data: logs,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }
}
