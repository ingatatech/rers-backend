import {
  Controller,
  Get,
  Param,
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
import { ReceiptsService } from './receipts.service';

@ApiTags('receipts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('receipts')
export class ReceiptsController {
  constructor(private readonly receiptsService: ReceiptsService) {}

  // GET /receipts
  @Roles(UserRole.FINANCE_OFFICER, UserRole.IRB_ADMIN, UserRole.RNEC_ADMIN, UserRole.SYSTEM_ADMIN)
  @Get()
  @ApiOperation({ summary: 'Get all receipts (FINANCE_OFFICER / admin)' })
  @ApiResponse({ status: 200, description: 'Receipts returned.' })
  findAll(@CurrentUser() user: JwtPayload) {
    const tenantId =
      user.role === UserRole.FINANCE_OFFICER || user.role === UserRole.IRB_ADMIN
        ? (user.tenantId ?? undefined)
        : undefined;

    return this.receiptsService.findAll(tenantId);
  }

  // GET /receipts/:id
  @Get(':id')
  @ApiOperation({ summary: 'Get a single receipt by id' })
  @ApiParam({ name: 'id', description: 'Receipt UUID' })
  @ApiResponse({ status: 200, description: 'Receipt returned.' })
  @ApiResponse({ status: 404, description: 'Receipt not found.' })
  findOne(@Param('id') id: string) {
    return this.receiptsService.findOne(id);
  }

  // GET /receipts/payment/:paymentId
  @Get('payment/:paymentId')
  @ApiOperation({ summary: 'Get receipt for a payment' })
  @ApiParam({ name: 'paymentId', description: 'Payment UUID' })
  @ApiResponse({ status: 200, description: 'Receipt returned.' })
  @ApiResponse({ status: 404, description: 'Payment not found.' })
  findByPayment(@Param('paymentId') paymentId: string) {
    return this.receiptsService.findByPayment(paymentId);
  }
}
