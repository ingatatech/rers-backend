import {
  Body,
  Controller,
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
import { MonitoringType } from '../../common/enums';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { MonitoringService } from './monitoring.service';
import { CreateAmendmentDto } from './dto/create-amendment.dto';
import { CreateRenewalDto } from './dto/create-renewal.dto';
import { CreateProgressReportDto } from './dto/create-progress-report.dto';
import { CreateAdverseEventDto } from './dto/create-adverse-event.dto';
import { CreateDeviationDto } from './dto/create-deviation.dto';
import { CreateClosureDto } from './dto/create-closure.dto';

@ApiTags('monitoring')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('monitoring')
export class MonitoringController {
  constructor(private readonly monitoringService: MonitoringService) {}

  // ─── AMENDMENTS ────────────────────────────────────────────────────────────────

  @Post('applications/:id/amendments')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit an amendment for an application' })
  @ApiParam({ name: 'id', description: 'Application UUID' })
  @ApiResponse({ status: 201, description: 'Amendment created.' })
  createAmendment(
    @Param('id') id: string,
    @Body() dto: CreateAmendmentDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.monitoringService.createAmendment(id, user.id, dto);
  }

  @Get('applications/:id/amendments')
  @ApiOperation({ summary: 'Get amendments for an application' })
  @ApiParam({ name: 'id', description: 'Application UUID' })
  @ApiResponse({ status: 200, description: 'Amendments returned.' })
  getAmendments(@Param('id') id: string) {
    return this.monitoringService.getByApplication(id, MonitoringType.AMENDMENT);
  }

  // ─── RENEWALS ─────────────────────────────────────────────────────────────────

  @Post('applications/:id/renewals')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit a renewal for an application' })
  @ApiParam({ name: 'id', description: 'Application UUID' })
  @ApiResponse({ status: 201, description: 'Renewal created.' })
  createRenewal(
    @Param('id') id: string,
    @Body() dto: CreateRenewalDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.monitoringService.createRenewal(id, user.id, dto);
  }

  @Get('applications/:id/renewals')
  @ApiOperation({ summary: 'Get renewals for an application' })
  @ApiParam({ name: 'id', description: 'Application UUID' })
  @ApiResponse({ status: 200, description: 'Renewals returned.' })
  getRenewals(@Param('id') id: string) {
    return this.monitoringService.getByApplication(id, MonitoringType.RENEWAL);
  }

  // ─── PROGRESS REPORTS ─────────────────────────────────────────────────────────

  @Post('applications/:id/progress-reports')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit a progress report for an application' })
  @ApiParam({ name: 'id', description: 'Application UUID' })
  @ApiResponse({ status: 201, description: 'Progress report created.' })
  createProgressReport(
    @Param('id') id: string,
    @Body() dto: CreateProgressReportDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.monitoringService.createProgressReport(id, user.id, dto);
  }

  @Get('applications/:id/progress-reports')
  @ApiOperation({ summary: 'Get progress reports for an application' })
  @ApiParam({ name: 'id', description: 'Application UUID' })
  @ApiResponse({ status: 200, description: 'Progress reports returned.' })
  getProgressReports(@Param('id') id: string) {
    return this.monitoringService.getByApplication(id, MonitoringType.PROGRESS_REPORT);
  }

  // ─── ADVERSE EVENTS ───────────────────────────────────────────────────────────

  @Post('applications/:id/adverse-events')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Report an adverse event for an application' })
  @ApiParam({ name: 'id', description: 'Application UUID' })
  @ApiResponse({ status: 201, description: 'Adverse event reported.' })
  createAdverseEvent(
    @Param('id') id: string,
    @Body() dto: CreateAdverseEventDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.monitoringService.createAdverseEvent(id, user.id, dto);
  }

  @Get('applications/:id/adverse-events')
  @ApiOperation({ summary: 'Get adverse events for an application' })
  @ApiParam({ name: 'id', description: 'Application UUID' })
  @ApiResponse({ status: 200, description: 'Adverse events returned.' })
  getAdverseEvents(@Param('id') id: string) {
    return this.monitoringService.getByApplication(id, MonitoringType.ADVERSE_EVENT);
  }

  // ─── PROTOCOL DEVIATIONS ──────────────────────────────────────────────────────

  @Post('applications/:id/deviations')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Report a protocol deviation for an application' })
  @ApiParam({ name: 'id', description: 'Application UUID' })
  @ApiResponse({ status: 201, description: 'Deviation reported.' })
  createDeviation(
    @Param('id') id: string,
    @Body() dto: CreateDeviationDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.monitoringService.createDeviation(id, user.id, dto);
  }

  @Get('applications/:id/deviations')
  @ApiOperation({ summary: 'Get protocol deviations for an application' })
  @ApiParam({ name: 'id', description: 'Application UUID' })
  @ApiResponse({ status: 200, description: 'Deviations returned.' })
  getDeviations(@Param('id') id: string) {
    return this.monitoringService.getByApplication(
      id,
      MonitoringType.PROTOCOL_DEVIATION,
    );
  }

  // ─── CLOSURE REPORTS ──────────────────────────────────────────────────────────

  @Post('applications/:id/closure-reports')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit a closure report for an application' })
  @ApiParam({ name: 'id', description: 'Application UUID' })
  @ApiResponse({ status: 201, description: 'Closure report created.' })
  createClosureReport(
    @Param('id') id: string,
    @Body() dto: CreateClosureDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.monitoringService.createClosureReport(id, user.id, dto);
  }

  @Get('applications/:id/closure-reports')
  @ApiOperation({ summary: 'Get closure reports for an application' })
  @ApiParam({ name: 'id', description: 'Application UUID' })
  @ApiResponse({ status: 200, description: 'Closure reports returned.' })
  getClosureReports(@Param('id') id: string) {
    return this.monitoringService.getByApplication(
      id,
      MonitoringType.CLOSURE_REPORT,
    );
  }
}
