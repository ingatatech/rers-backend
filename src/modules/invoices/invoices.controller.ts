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
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';

@ApiTags('invoices')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  // POST /invoices/application/:applicationId
  @Roles(UserRole.FINANCE_OFFICER)
  @Post('application/:applicationId')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create an invoice for an application' })
  @ApiParam({ name: 'applicationId', description: 'Application UUID' })
  @ApiResponse({ status: 201, description: 'Invoice created.' })
  @ApiResponse({ status: 404, description: 'Application not found.' })
  create(
    @Param('applicationId') applicationId: string,
    @Body() dto: CreateInvoiceDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.invoicesService.create(applicationId, dto, {
      id: user.id,
      role: user.role,
      tenantId: user.tenantId ?? null,
    });
  }

  // GET /invoices/application/:applicationId
  @Get('application/:applicationId')
  @ApiOperation({ summary: 'Get all invoices for an application' })
  @ApiParam({ name: 'applicationId', description: 'Application UUID' })
  @ApiResponse({ status: 200, description: 'Invoices returned.' })
  findByApplication(@Param('applicationId') applicationId: string) {
    return this.invoicesService.findByApplication(applicationId);
  }

  // GET /invoices
  @Roles(UserRole.FINANCE_OFFICER, UserRole.IRB_ADMIN, UserRole.RNEC_ADMIN, UserRole.SYSTEM_ADMIN)
  @Get()
  @ApiOperation({ summary: 'Get all invoices (FINANCE_OFFICER / admin)' })
  @ApiResponse({ status: 200, description: 'Invoices returned.' })
  findAll(@CurrentUser() user: JwtPayload) {
    const tenantId =
      user.role === UserRole.FINANCE_OFFICER || user.role === UserRole.IRB_ADMIN
        ? (user.tenantId ?? undefined)
        : undefined;

    return this.invoicesService.findAll(tenantId);
  }
}
