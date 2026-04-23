import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AssignPermissionDto } from './dto/assign-permission.dto';
import { RolesService } from './roles.service';

@ApiTags('roles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  // ─── GET /roles ──────────────────────────────────────────────────────────────

  @Get()
  @ApiOperation({ summary: 'List all roles with their permissions' })
  @ApiResponse({ status: 200, description: 'Array of roles returned.' })
  findAll() {
    return this.rolesService.findAll();
  }

  // ─── GET /roles/:id ──────────────────────────────────────────────────────────

  @Get(':id')
  @ApiOperation({ summary: 'Get a single role by id' })
  @ApiParam({ name: 'id', description: 'Role UUID' })
  @ApiResponse({ status: 200, description: 'Role record returned.' })
  @ApiResponse({ status: 404, description: 'Role not found.' })
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  // ─── POST /roles/:id/permissions ─────────────────────────────────────────────

  @Roles(UserRole.SYSTEM_ADMIN)
  @Post(':id/permissions')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Assign a permission to a role (SYSTEM_ADMIN only)' })
  @ApiParam({ name: 'id', description: 'Role UUID' })
  @ApiResponse({ status: 200, description: 'Permission assigned; updated role returned.' })
  @ApiResponse({ status: 404, description: 'Role or permission not found.' })
  @ApiResponse({ status: 409, description: 'Permission already assigned.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  assignPermission(
    @Param('id') id: string,
    @Body() dto: AssignPermissionDto,
  ) {
    return this.rolesService.assignPermission(id, dto);
  }

  // ─── DELETE /roles/:id/permissions/:permId ───────────────────────────────────

  @Roles(UserRole.SYSTEM_ADMIN)
  @Delete(':id/permissions/:permId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Remove a permission from a role (SYSTEM_ADMIN only)',
  })
  @ApiParam({ name: 'id', description: 'Role UUID' })
  @ApiParam({ name: 'permId', description: 'Permission UUID' })
  @ApiResponse({ status: 200, description: 'Permission removed; updated role returned.' })
  @ApiResponse({ status: 404, description: 'Role or permission assignment not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  removePermission(
    @Param('id') id: string,
    @Param('permId') permId: string,
  ) {
    return this.rolesService.removePermission(id, permId);
  }
}
