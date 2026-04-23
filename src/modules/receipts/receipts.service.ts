import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../../common/database/database.service';

@Injectable()
export class ReceiptsService {
  constructor(private readonly database: DatabaseService) {}

  // ─── create ──────────────────────────────────────────────────────────────────

  async create(paymentId: string, amount: number) {
    const receiptNumber = await this.generateReceiptNumber();

    return this.database.receipt.create({
      data: {
        paymentId,
        receiptNumber,
        amount,
        issuedAt: new Date(),
      },
      include: {
        payment: {
          select: {
            id: true,
            invoiceId: true,
            amount: true,
            method: true,
            referenceNumber: true,
          },
        },
      },
    });
  }

  // ─── findByPayment ────────────────────────────────────────────────────────────

  async findByPayment(paymentId: string) {
    const payment = await this.database.payment.findUnique({
      where: { id: paymentId },
      select: { id: true },
    });

    if (!payment) {
      throw new NotFoundException(`Payment "${paymentId}" not found.`);
    }

    return this.database.receipt.findFirst({
      where: { paymentId },
      include: {
        payment: {
          select: {
            id: true,
            invoiceId: true,
            amount: true,
            method: true,
            referenceNumber: true,
          },
        },
      },
    });
  }

  // ─── findOne ─────────────────────────────────────────────────────────────────

  async findOne(id: string) {
    const receipt = await this.database.receipt.findUnique({
      where: { id },
      include: {
        payment: {
          select: {
            id: true,
            invoiceId: true,
            amount: true,
            method: true,
            referenceNumber: true,
            invoice: {
              select: {
                id: true,
                applicationId: true,
                amount: true,
                currency: true,
              },
            },
          },
        },
      },
    });

    if (!receipt) {
      throw new NotFoundException(`Receipt "${id}" not found.`);
    }

    return receipt;
  }

  // ─── findAll ─────────────────────────────────────────────────────────────────

  async findAll(tenantId?: string, filters?: { paymentId?: string }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: Record<string, any> = {};

    if (filters?.paymentId) {
      where.paymentId = filters.paymentId;
    }

    if (tenantId) {
      where.payment = {
        invoice: {
          application: { tenantId },
        },
      };
    }

    return this.database.receipt.findMany({
      where,
      include: {
        payment: {
          select: {
            id: true,
            invoiceId: true,
            amount: true,
            method: true,
            referenceNumber: true,
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
                    applicant: {
                      select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { issuedAt: 'desc' },
    });
  }

  // ─── generateReceiptNumber ────────────────────────────────────────────────────

  private async generateReceiptNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `RCPT-${year}-`;

    const count = await this.database.receipt.count({
      where: { receiptNumber: { startsWith: prefix } },
    });

    const sequence = String(count + 1).padStart(4, '0');
    return `${prefix}${sequence}`;
  }
}
