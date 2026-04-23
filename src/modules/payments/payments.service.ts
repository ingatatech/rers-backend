import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  ApplicationStatus,
  NotificationType,
  PaymentStatus,
} from '../../common/enums';
import { DatabaseService } from '../../common/database/database.service';
import { ReceiptsService } from '../receipts/receipts.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly database: DatabaseService,
    private readonly receiptsService: ReceiptsService,
  ) {}

  // ─── create ──────────────────────────────────────────────────────────────────

  async create(invoiceId: string, dto: CreatePaymentDto) {
    const invoice = await this.database.invoice.findUnique({
      where: { id: invoiceId },
      select: { id: true, status: true, applicationId: true, amount: true },
    });

    if (!invoice) {
      throw new NotFoundException(`Invoice "${invoiceId}" not found.`);
    }

    if (invoice.status === PaymentStatus.VERIFIED) {
      throw new BadRequestException('This invoice has already been paid and verified.');
    }

    return this.database.payment.create({
      data: {
        invoiceId,
        amount: dto.amount,
        method: dto.method,
        referenceNumber: dto.referenceNumber,
        notes: dto.notes,
        status: PaymentStatus.PENDING,
      },
      include: {
        invoice: {
          select: { id: true, applicationId: true, amount: true, currency: true },
        },
      },
    });
  }

  // ─── verify ──────────────────────────────────────────────────────────────────

  async verify(paymentId: string, officerId: string, dto: VerifyPaymentDto) {
    const payment = await this.database.payment.findUnique({
      where: { id: paymentId },
      include: {
        invoice: {
          select: {
            id: true,
            applicationId: true,
            application: {
              select: {
                id: true,
                status: true,
                applicantId: true,
                title: true,
              },
            },
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException(`Payment "${paymentId}" not found.`);
    }

    if (payment.status === PaymentStatus.VERIFIED) {
      throw new BadRequestException('Payment has already been verified.');
    }

    // Update payment
    const updatedPayment = await this.database.payment.update({
      where: { id: paymentId },
      data: {
        status: PaymentStatus.VERIFIED,
        verifiedById: officerId,
        verifiedAt: new Date(),
        notes: dto.notes ?? payment.notes,
      },
    });

    // Update invoice status
    await this.database.invoice.update({
      where: { id: payment.invoiceId },
      data: { status: PaymentStatus.VERIFIED },
    });

    const application = payment.invoice.application;

    // Update application status to PAYMENT_VERIFIED
    await this.database.application.update({
      where: { id: application.id },
      data: { status: ApplicationStatus.PAYMENT_VERIFIED },
    });

    await this.database.workflowTransition.create({
      data: {
        applicationId: application.id,
        fromStatus: application.status,
        toStatus: ApplicationStatus.PAYMENT_VERIFIED,
        actorId: officerId,
        reason: 'Payment verified by finance officer',
      },
    });

    // Notify applicant
    await this.database.notification.create({
      data: {
        userId: application.applicantId,
        type: NotificationType.PAYMENT_VERIFIED,
        title: 'Payment Verified',
        message: `Your payment for application "${application.title}" has been verified.`,
        metadata: { applicationId: application.id, paymentId },
      },
    });

    // Auto-create receipt
    await this.receiptsService.create(
      paymentId,
      Number(payment.amount),
    );

    return updatedPayment;
  }

  // ─── findAll ─────────────────────────────────────────────────────────────────

  async findAll(tenantId?: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: Record<string, any> = {};

    if (tenantId) {
      where.invoice = {
        application: { tenantId },
      };
    }

    return this.database.payment.findMany({
      where,
      include: {
        invoice: {
          select: {
            id: true,
            amount: true,
            currency: true,
            application: {
              select: {
                id: true,
                referenceNumber: true,
                title: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ─── findByInvoice ────────────────────────────────────────────────────────────

  async findByInvoice(invoiceId: string) {
    const invoice = await this.database.invoice.findUnique({
      where: { id: invoiceId },
      select: { id: true },
    });

    if (!invoice) {
      throw new NotFoundException(`Invoice "${invoiceId}" not found.`);
    }

    return this.database.payment.findMany({
      where: { invoiceId },
      include: {
        receipts: { select: { id: true, receiptNumber: true, issuedAt: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
