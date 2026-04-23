import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  ApplicationStatus,
  NotificationType,
  PaymentStatus,
} from '../../common/enums';
import { DatabaseService } from '../../common/database/database.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UserRole } from '../../common/enums/user-role.enum';

interface InvoiceActorContext {
  id: string;
  role: UserRole;
  tenantId: string | null;
}

@Injectable()
export class InvoicesService {
  constructor(private readonly database: DatabaseService) {}

  // ─── create ──────────────────────────────────────────────────────────────────

  async create(
    applicationId: string,
    dto: CreateInvoiceDto,
    actor: InvoiceActorContext,
  ) {
    const application = await this.database.application.findUnique({
      where: { id: applicationId },
      select: {
        id: true,
        status: true,
        title: true,
        applicantId: true,
        tenantId: true,
      },
    });

    if (!application) {
      throw new NotFoundException(`Application "${applicationId}" not found.`);
    }

    if (
      actor.role === UserRole.FINANCE_OFFICER
      && application.tenantId !== actor.tenantId
    ) {
      throw new ForbiddenException(
        'You can only create invoices for applications in your tenant.',
      );
    }

    if (application.status !== ApplicationStatus.PAYMENT_PENDING) {
      throw new BadRequestException(
        `Only applications in PAYMENT_PENDING status can be invoiced. Current status: "${application.status}".`,
      );
    }

    const existingInvoice = await this.database.invoice.findFirst({
      where: {
        applicationId,
        status: { in: [PaymentStatus.PENDING, PaymentStatus.VERIFIED] },
      },
      select: { id: true },
    });

    if (existingInvoice) {
      throw new ConflictException(
        'An active invoice already exists for this application.',
      );
    }

    const invoice = await this.database.invoice.create({
      data: {
        applicationId,
        amount: dto.amount,
        description: dto.description,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        currency: dto.currency ?? 'KES',
      },
      include: {
        application: {
          select: { id: true, referenceNumber: true, title: true },
        },
      },
    });

    // Notify applicant
    await this.database.notification.create({
      data: {
        userId: application.applicantId,
        type: NotificationType.PAYMENT_PENDING,
        title: 'Payment Required',
        message: `An invoice of ${dto.currency ?? 'KES'} ${dto.amount} has been issued for your application: ${application.title}`,
        metadata: { applicationId, invoiceId: invoice.id },
      },
    });

    return invoice;
  }

  // ─── findByApplication ────────────────────────────────────────────────────────

  async findByApplication(applicationId: string) {
    const application = await this.database.application.findUnique({
      where: { id: applicationId },
      select: { id: true },
    });

    if (!application) {
      throw new NotFoundException(`Application "${applicationId}" not found.`);
    }

    return this.database.invoice.findMany({
      where: { applicationId },
      include: {
        payments: {
          select: {
            id: true,
            amount: true,
            status: true,
            method: true,
            referenceNumber: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ─── findAll ─────────────────────────────────────────────────────────────────

  async findAll(tenantId?: string, filters?: { status?: string }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: Record<string, any> = {};

    if (tenantId) {
      where.application = { tenantId };
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    return this.database.invoice.findMany({
      where,
      include: {
        application: {
          select: {
            id: true,
            referenceNumber: true,
            title: true,
            tenantId: true,
          },
        },
        payments: {
          select: { id: true, amount: true, status: true, createdAt: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
