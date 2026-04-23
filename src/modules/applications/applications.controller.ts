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
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { ApplicationsService } from './applications.service';
import { AdvanceStatusDto } from './dto/advance-status.dto';
import { CreateApplicationDto } from './dto/create-application.dto';
import { QueryApplicationsDto } from './dto/query-applications.dto';
import { ScreenApplicationDto } from './dto/screen-application.dto';
import { SubmitApplicationDto } from './dto/submit-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';

@ApiTags('applications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  // ─── POST /applications ───────────────────────────────────────────────────────

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new application in DRAFT status' })
  @ApiResponse({ status: 201, description: 'Application created.' })
  @ApiResponse({ status: 404, description: 'Tenant not found.' })
  create(
    @Body() dto: CreateApplicationDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.applicationsService.create(user.id, user.tenantId ?? null, dto);
  }

  // ─── GET /applications ────────────────────────────────────────────────────────

  @Get()
  @ApiOperation({
    summary:
      'List applications (role-scoped: applicants see own, IRB_ADMIN sees tenant, RNEC/SYSTEM see all)',
  })
  @ApiResponse({ status: 200, description: 'Paginated list of applications.' })
  findAll(
    @Query() filters: QueryApplicationsDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.applicationsService.findAll(
      user.id,
      user.role,
      user.tenantId,
      filters,
    );
  }

  // ─── GET /applications/:id ────────────────────────────────────────────────────

  @Get(':id')
  @ApiOperation({ summary: 'Get a single application by id (role-scoped)' })
  @ApiParam({ name: 'id', description: 'Application UUID' })
  @ApiResponse({ status: 200, description: 'Application record returned.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Application not found.' })
  findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.applicationsService.findOne(id, user.id, user.role);
  }

  // ─── PATCH /applications/:id ──────────────────────────────────────────────────

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a DRAFT application (applicant only)' })
  @ApiParam({ name: 'id', description: 'Application UUID' })
  @ApiResponse({ status: 200, description: 'Application updated.' })
  @ApiResponse({ status: 400, description: 'Application is not in DRAFT status.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Application not found.' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateApplicationDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.applicationsService.update(id, user.id, dto);
  }

  // ─── DELETE /applications/:id ────────────────────────────────────────────────

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a DRAFT application (applicant only)' })
  @ApiParam({ name: 'id', description: 'Application UUID' })
  @ApiResponse({ status: 204, description: 'Application deleted.' })
  @ApiResponse({ status: 400, description: 'Application is not in DRAFT status.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Application not found.' })
  remove(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.applicationsService.remove(id, user.id);
  }

  // ─── POST /applications/:id/submit ────────────────────────────────────────────

  @Post(':id/submit')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Submit an application (validates documents attached, sets SUBMITTED status, generates referenceNumber)',
  })
  @ApiParam({ name: 'id', description: 'Application UUID' })
  @ApiResponse({ status: 200, description: 'Application submitted.' })
  @ApiResponse({ status: 400, description: 'No documents attached or not in DRAFT.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Application not found.' })
  submit(
    @Param('id') id: string,
    @Body() _dto: SubmitApplicationDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.applicationsService.submit(id, user.id);
  }

  // ─── POST /applications/:id/screen ────────────────────────────────────────────

  @Roles(UserRole.IRB_ADMIN, UserRole.RNEC_ADMIN, UserRole.SYSTEM_ADMIN)
  @Post(':id/screen')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Screen an application: PASS → UNDER_REVIEW, RAISE_QUERY → QUERY_RAISED, REQUEST_PAYMENT → PAYMENT_PENDING',
  })
  @ApiParam({ name: 'id', description: 'Application UUID' })
  @ApiResponse({ status: 200, description: 'Application screened; new status returned.' })
  @ApiResponse({ status: 400, description: 'Application is not in SCREENING status.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Application not found.' })
  screen(
    @Param('id') id: string,
    @Body() dto: ScreenApplicationDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.applicationsService.screen(id, user.id, dto);
  }

  // ─── PATCH /applications/:id/status ──────────────────────────────────────────

  @Roles(
    UserRole.IRB_ADMIN,
    UserRole.RNEC_ADMIN,
    UserRole.SYSTEM_ADMIN,
    UserRole.CHAIRPERSON,
    UserRole.FINANCE_OFFICER,
  )
  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Generic status advance endpoint (validates state machine transitions)',
  })
  @ApiParam({ name: 'id', description: 'Application UUID' })
  @ApiResponse({ status: 200, description: 'Status advanced.' })
  @ApiResponse({ status: 400, description: 'Invalid transition.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Application not found.' })
  advanceStatus(
    @Param('id') id: string,
    @Body() dto: AdvanceStatusDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.applicationsService.advanceStatus(id, user.id, dto);
  }

  // ─── GET /applications/:id/timeline ──────────────────────────────────────────

  @Get(':id/timeline')
  @ApiOperation({ summary: 'Get the workflow timeline for an application' })
  @ApiParam({ name: 'id', description: 'Application UUID' })
  @ApiResponse({ status: 200, description: 'Workflow timeline returned.' })
  @ApiResponse({ status: 404, description: 'Application not found.' })
  getTimeline(@Param('id') id: string) {
    return this.applicationsService.getTimeline(id);
  }
}
