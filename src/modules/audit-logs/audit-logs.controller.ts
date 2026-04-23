import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AuditLogsService } from './audit-logs.service';
import { QueryAuditLogsDto } from './dto/query-audit-logs.dto';

@ApiTags('audit-logs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('audit-logs')
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  // GET /audit-logs
  @Roles(UserRole.SYSTEM_ADMIN, UserRole.RNEC_ADMIN)
  @Get()
  @ApiOperation({
    summary: 'Get audit logs with filtering (SYSTEM_ADMIN / RNEC_ADMIN)',
  })
  @ApiResponse({ status: 200, description: 'Paginated audit logs returned.' })
  findAll(@Query() filters: QueryAuditLogsDto) {
    return this.auditLogsService.findAll(filters);
  }
}
