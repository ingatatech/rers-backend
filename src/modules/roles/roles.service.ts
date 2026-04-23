import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../../common/database/database.service';
import { AssignPermissionDto } from './dto/assign-permission.dto';

@Injectable()
export class RolesService {
  constructor(private readonly database: DatabaseService) {}

  // ─── findAll ─────────────────────────────────────────────────────────────────

  async findAll() {
    return this.database.role.findMany({
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
        _count: { select: { users: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  // ─── findOne ─────────────────────────────────────────────────────────────────

  async findOne(id: string) {
    const role = await this.database.role.findUnique({
      where: { id },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
        _count: { select: { users: true } },
      },
    });

    if (!role) {
      throw new NotFoundException(`Role with id "${id}" not found.`);
    }

    return role;
  }

  // ─── assignPermission ────────────────────────────────────────────────────────

  async assignPermission(roleId: string, dto: AssignPermissionDto) {
    await this.findOne(roleId);

    const permission = await this.database.permission.findUnique({
      where: { id: dto.permissionId },
    });

    if (!permission) {
      throw new NotFoundException(
        `Permission with id "${dto.permissionId}" not found.`,
      );
    }

    const existing = await this.database.rolePermission.findUnique({
      where: {
        roleId_permissionId: { roleId, permissionId: dto.permissionId },
      },
    });

    if (existing) {
      throw new ConflictException(
        `Permission "${permission.name}" is already assigned to this role.`,
      );
    }

    await this.database.rolePermission.create({
      data: { roleId, permissionId: dto.permissionId },
    });

    return this.findOne(roleId);
  }

  // ─── removePermission ────────────────────────────────────────────────────────

  async removePermission(roleId: string, permId: string) {
    await this.findOne(roleId);

    const existing = await this.database.rolePermission.findUnique({
      where: { roleId_permissionId: { roleId, permissionId: permId } },
    });

    if (!existing) {
      throw new NotFoundException(
        `Permission "${permId}" is not assigned to this role.`,
      );
    }

    await this.database.rolePermission.delete({
      where: { roleId_permissionId: { roleId, permissionId: permId } },
    });

    return this.findOne(roleId);
  }
}
