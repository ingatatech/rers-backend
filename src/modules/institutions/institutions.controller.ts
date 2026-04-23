import {
  Body,
  Controller,
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
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { UpdateInstitutionDto } from './dto/update-institution.dto';
import { InstitutionsService } from './institutions.service';

@ApiTags('institutions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('institutions')
export class InstitutionsController {
  constructor(private readonly institutionsService: InstitutionsService) {}

  // ─── POST /institutions ──────────────────────────────────────────────────────

  @Roles(UserRole.IRB_ADMIN, UserRole.RNEC_ADMIN, UserRole.SYSTEM_ADMIN)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new institution (IRB_ADMIN, RNEC_ADMIN, SYSTEM_ADMIN)' })
  @ApiResponse({ status: 201, description: 'Institution created.' })
  @ApiResponse({ status: 409, description: 'Institution code already exists.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(@Body() dto: CreateInstitutionDto) {
    return this.institutionsService.create(dto);
  }

  // ─── GET /institutions ───────────────────────────────────────────────────────

  @Get()
  @ApiOperation({ summary: 'List institutions, optionally filtered by tenantId or search' })
  @ApiQuery({ name: 'tenantId', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Array of institutions returned.' })
  findAll(
    @Query('tenantId') tenantId?: string,
    @Query('search') search?: string,
  ) {
    return this.institutionsService.findAll(tenantId, search);
  }

  // ─── GET /institutions/:id ───────────────────────────────────────────────────

  @Get(':id')
  @ApiOperation({ summary: 'Get a single institution by id' })
  @ApiParam({ name: 'id', description: 'Institution UUID' })
  @ApiResponse({ status: 200, description: 'Institution record returned.' })
  @ApiResponse({ status: 404, description: 'Institution not found.' })
  findOne(@Param('id') id: string) {
    return this.institutionsService.findOne(id);
  }

  // ─── PATCH /institutions/:id ─────────────────────────────────────────────────

  @Roles(UserRole.IRB_ADMIN, UserRole.RNEC_ADMIN, UserRole.SYSTEM_ADMIN)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update an institution (IRB_ADMIN, RNEC_ADMIN, SYSTEM_ADMIN)' })
  @ApiParam({ name: 'id', description: 'Institution UUID' })
  @ApiResponse({ status: 200, description: 'Institution updated.' })
  @ApiResponse({ status: 404, description: 'Institution not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  update(@Param('id') id: string, @Body() dto: UpdateInstitutionDto) {
    return this.institutionsService.update(id, dto);
  }
}
