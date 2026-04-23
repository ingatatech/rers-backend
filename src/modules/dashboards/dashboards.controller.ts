import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { DashboardsService } from './dashboards.service';

@ApiTags('dashboards')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('dashboards')
export class DashboardsController {
  constructor(private readonly dashboardsService: DashboardsService) {}

  // GET /dashboards/summary — generic, role-dispatched
  @Get('summary')
  @ApiOperation({ summary: 'Get role-scoped dashboard summary (authenticated)' })
  @ApiResponse({ status: 200, description: 'Dashboard summary returned.' })
  getSummary(@CurrentUser() user: JwtPayload) {
    return this.dashboardsService.getSummary(user.role, user.id, user.tenantId);
  }

  // GET /dashboards/applicant
  @Roles(UserRole.APPLICANT)
  @Get('applicant')
  @ApiOperation({ summary: 'Applicant dashboard' })
  getApplicantDashboard(@CurrentUser() user: JwtPayload) {
    return this.dashboardsService.getApplicantDashboard(user.id);
  }

  // GET /dashboards/reviewer
  @Roles(UserRole.REVIEWER)
  @Get('reviewer')
  @ApiOperation({ summary: 'Reviewer dashboard' })
  getReviewerDashboard(@CurrentUser() user: JwtPayload) {
    return this.dashboardsService.getReviewerDashboard(user.id);
  }

  // GET /dashboards/irb_admin
  @Roles(UserRole.IRB_ADMIN)
  @Get('irb_admin')
  @ApiOperation({ summary: 'IRB Admin dashboard' })
  getIrbAdminDashboard(@CurrentUser() user: JwtPayload) {
    return this.dashboardsService.getSummary(user.role, user.id, user.tenantId);
  }

  // GET /dashboards/rnec — cross-tenant
  @Roles(UserRole.RNEC_ADMIN, UserRole.SYSTEM_ADMIN)
  @Get('rnec')
  @ApiOperation({ summary: 'Full cross-tenant dashboard (RNEC_ADMIN / SYSTEM_ADMIN)' })
  @ApiResponse({ status: 200, description: 'Cross-tenant summary returned.' })
  getRnecSummary() {
    return this.dashboardsService.getRnecSummary();
  }

  // GET /dashboards/rnec_admin
  @Roles(UserRole.RNEC_ADMIN, UserRole.SYSTEM_ADMIN)
  @Get('rnec_admin')
  @ApiOperation({ summary: 'RNEC admin dashboard alias' })
  getRnecAdminDashboard() {
    return this.dashboardsService.getRnecSummary();
  }

  // GET /dashboards/system_admin
  @Roles(UserRole.SYSTEM_ADMIN)
  @Get('system_admin')
  @ApiOperation({ summary: 'System admin dashboard' })
  getSystemAdminDashboard() {
    return this.dashboardsService.getSystemAdminDashboard();
  }

  // GET /dashboards/chairperson
  @Roles(UserRole.CHAIRPERSON)
  @Get('chairperson')
  @ApiOperation({ summary: 'Chairperson dashboard' })
  getChairpersonDashboard(@CurrentUser() user: JwtPayload) {
    return this.dashboardsService.getSummary(user.role, user.id, user.tenantId);
  }

  // GET /dashboards/finance_officer
  @Roles(UserRole.FINANCE_OFFICER)
  @Get('finance_officer')
  @ApiOperation({ summary: 'Finance officer dashboard' })
  getFinanceDashboard(@CurrentUser() user: JwtPayload) {
    return this.dashboardsService.getSummary(user.role, user.id, user.tenantId);
  }
}
