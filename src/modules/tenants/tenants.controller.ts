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
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { QueryTenantDto } from './dto/query-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { TenantsService } from './tenants.service';

@ApiTags('tenants')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  // ─── POST /tenants ────────────────────────────────────────────────────────────

  @Roles(UserRole.RNEC_ADMIN, UserRole.SYSTEM_ADMIN)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new tenant (RNEC_ADMIN, SYSTEM_ADMIN)' })
  @ApiResponse({ status: 201, description: 'Tenant created.' })
  @ApiResponse({ status: 409, description: 'Tenant code already exists.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(@Body() dto: CreateTenantDto) {
    return this.tenantsService.create(dto);
  }

  // ─── GET /tenants ─────────────────────────────────────────────────────────────

  @Get()
  @ApiOperation({ summary: 'List tenants with pagination and filters' })
  @ApiResponse({ status: 200, description: 'Paginated list of tenants.' })
  findAll(@Query() query: QueryTenantDto) {
    return this.tenantsService.findAll(query);
  }

  // ─── GET /tenants/:id ────────────────────────────────────────────────────────

  @Get(':id')
  @ApiOperation({ summary: 'Get a single tenant by id' })
  @ApiParam({ name: 'id', description: 'Tenant UUID' })
  @ApiResponse({ status: 200, description: 'Tenant record returned.' })
  @ApiResponse({ status: 404, description: 'Tenant not found.' })
  findOne(@Param('id') id: string) {
    return this.tenantsService.findOne(id);
  }

  // ─── GET /tenants/:id/stats ───────────────────────────────────────────────────

  @Get(':id/stats')
  @ApiOperation({ summary: 'Get statistics for a tenant' })
  @ApiParam({ name: 'id', description: 'Tenant UUID' })
  @ApiResponse({ status: 200, description: 'Tenant statistics returned.' })
  @ApiResponse({ status: 404, description: 'Tenant not found.' })
  getStats(@Param('id') id: string) {
    return this.tenantsService.getTenantStats(id);
  }

  // ─── PATCH /tenants/:id ──────────────────────────────────────────────────────

  @Roles(UserRole.RNEC_ADMIN, UserRole.SYSTEM_ADMIN)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a tenant (RNEC_ADMIN, SYSTEM_ADMIN)' })
  @ApiParam({ name: 'id', description: 'Tenant UUID' })
  @ApiResponse({ status: 200, description: 'Tenant updated.' })
  @ApiResponse({ status: 404, description: 'Tenant not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  update(@Param('id') id: string, @Body() dto: UpdateTenantDto) {
    return this.tenantsService.update(id, dto);
  }

  // ─── DELETE /tenants/:id ─────────────────────────────────────────────────────

  @Roles(UserRole.RNEC_ADMIN, UserRole.SYSTEM_ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Deactivate a tenant (RNEC_ADMIN, SYSTEM_ADMIN)',
  })
  @ApiParam({ name: 'id', description: 'Tenant UUID' })
  @ApiResponse({ status: 200, description: 'Tenant deactivated.' })
  @ApiResponse({ status: 404, description: 'Tenant not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  remove(@Param('id') id: string) {
    return this.tenantsService.remove(id);
  }
}
