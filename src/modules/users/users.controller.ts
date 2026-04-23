import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { JwtPayload } from '../../common/decorators/current-user.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ─── POST /users ─────────────────────────────────────────────────────────────

  @Roles(UserRole.SYSTEM_ADMIN, UserRole.IRB_ADMIN)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a user (SYSTEM_ADMIN creates RNEC_ADMIN; IRB_ADMIN creates REVIEWER/FINANCE_OFFICER/CHAIRPERSON)',
  })
  @ApiResponse({ status: 201, description: 'User created.' })
  @ApiResponse({ status: 403, description: 'Forbidden role assignment.' })
  @ApiResponse({ status: 409, description: 'Email already exists.' })
  create(@Body() dto: CreateUserDto, @CurrentUser() user: JwtPayload) {
    return this.usersService.createUser(dto, user);
  }

  // ─── GET /users ──────────────────────────────────────────────────────────────

  @Roles(UserRole.IRB_ADMIN, UserRole.RNEC_ADMIN, UserRole.SYSTEM_ADMIN)
  @Get()
  @ApiOperation({
    summary: 'List users (IRB_ADMIN, RNEC_ADMIN, SYSTEM_ADMIN)',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'tenantId', required: false, type: String })
  @ApiQuery({ name: 'role', required: false, enum: UserRole })
  @ApiResponse({ status: 200, description: 'Paginated list of users.' })
  findAll(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('tenantId') tenantId?: string,
    @Query('role') role?: UserRole,
    @CurrentUser() user?: JwtPayload,
  ) {
    return this.usersService.findAll(
      {
        page: page ? parseInt(page, 10) : undefined,
        pageSize: pageSize ? parseInt(pageSize, 10) : undefined,
        tenantId,
        role,
      },
      user!,
    );
  }

  // ─── GET /users/:id ──────────────────────────────────────────────────────────

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by id' })
  @ApiResponse({ status: 200, description: 'User record returned.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  // ─── PATCH /users/:id ────────────────────────────────────────────────────────

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update user profile fields' })
  @ApiResponse({ status: 200, description: 'User updated.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  // ─── PATCH /users/:id/role ───────────────────────────────────────────────────

  @Roles(UserRole.SYSTEM_ADMIN)
  @Patch(':id/role')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update user role (SYSTEM_ADMIN only)' })
  @ApiResponse({ status: 200, description: 'User role updated.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  updateRole(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.usersService.updateRole(id, dto);
  }

  // ─── DELETE /users/:id ───────────────────────────────────────────────────────

  @Roles(UserRole.SYSTEM_ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Soft-delete (deactivate) a user (SYSTEM_ADMIN only)',
  })
  @ApiResponse({ status: 200, description: 'User deactivated.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
