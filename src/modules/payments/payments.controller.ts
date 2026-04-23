import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
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
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';

@ApiTags('payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // POST /invoices/:invoiceId/payments
  @Post('invoices/:invoiceId/payments')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit payment for an invoice (applicant)' })
  @ApiParam({ name: 'invoiceId', description: 'Invoice UUID' })
  @ApiResponse({ status: 201, description: 'Payment created.' })
  @ApiResponse({ status: 400, description: 'Invoice already paid.' })
  @ApiResponse({ status: 404, description: 'Invoice not found.' })
  create(
    @Param('invoiceId') invoiceId: string,
    @Body() dto: CreatePaymentDto,
  ) {
    return this.paymentsService.create(invoiceId, dto);
  }

  // GET /invoices/:invoiceId/payments
  @Get('invoices/:invoiceId/payments')
  @ApiOperation({ summary: 'Get all payments for an invoice' })
  @ApiParam({ name: 'invoiceId', description: 'Invoice UUID' })
  @ApiResponse({ status: 200, description: 'Payments returned.' })
  findByInvoice(@Param('invoiceId') invoiceId: string) {
    return this.paymentsService.findByInvoice(invoiceId);
  }

  // GET /payments
  @Roles(UserRole.FINANCE_OFFICER, UserRole.IRB_ADMIN, UserRole.RNEC_ADMIN, UserRole.SYSTEM_ADMIN)
  @Get('payments')
  @ApiOperation({ summary: 'Get all payments (FINANCE_OFFICER / admin)' })
  @ApiResponse({ status: 200, description: 'Payments returned.' })
  findAll(@CurrentUser() user: JwtPayload) {
    const tenantId =
      user.role === UserRole.FINANCE_OFFICER || user.role === UserRole.IRB_ADMIN
        ? (user.tenantId ?? undefined)
        : undefined;

    return this.paymentsService.findAll(tenantId);
  }

  // PATCH /payments/:id/verify
  @Roles(UserRole.FINANCE_OFFICER, UserRole.IRB_ADMIN, UserRole.RNEC_ADMIN, UserRole.SYSTEM_ADMIN)
  @Patch('payments/:id/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify a payment (FINANCE_OFFICER)' })
  @ApiParam({ name: 'id', description: 'Payment UUID' })
  @ApiResponse({ status: 200, description: 'Payment verified.' })
  @ApiResponse({ status: 400, description: 'Already verified.' })
  @ApiResponse({ status: 404, description: 'Payment not found.' })
  verify(
    @Param('id') id: string,
    @Body() dto: VerifyPaymentDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.paymentsService.verify(id, user.id, dto);
  }
}
