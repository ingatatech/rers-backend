import { Injectable, NotFoundException } from '@nestjs/common';
import { ApplicationStatus } from '../../common/enums';
import { DatabaseService } from '../../common/database/database.service';
import { CertificatesService } from '../certificates/certificates.service';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

@Injectable()
export class RegistryService {
  constructor(
    private readonly database: DatabaseService,
    private readonly certificatesService: CertificatesService,
  ) {}

  // ─── findAll ─────────────────────────────────────────────────────────────────

  async findAll(filters?: {
    page?: string;
    pageSize?: string;
    type?: string;
    search?: string;
  }) {
    const page = Math.max(1, parseInt(filters?.page ?? '1', 10) || DEFAULT_PAGE);
    const pageSize = Math.min(
      MAX_PAGE_SIZE,
      Math.max(1, parseInt(filters?.pageSize ?? '20', 10) || DEFAULT_PAGE_SIZE),
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: Record<string, any> = {
      status: ApplicationStatus.APPROVED,
    };

    if (filters?.type) {
      where.type = filters.type;
    }

    if (filters?.search) {
      where.title = { contains: filters.search, mode: 'insensitive' };
    }

    const [applications, total] = await this.database.$transaction([
      this.database.application.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { submittedAt: 'desc' },
        select: {
          id: true,
          referenceNumber: true,
          title: true,
          type: true,
          submittedAt: true,
          destination: { select: { id: true, name: true } },
          certificates: {
            select: {
              certificateNumber: true,
              issuedAt: true,
              expiresAt: true,
            },
          },
        },
      }),
      this.database.application.count({ where }),
    ]);

    const data = applications.map((app) => ({
      id: app.id,
      referenceNumber: app.referenceNumber,
      title: app.title,
      type: app.type,
      institution: app.destination?.name ?? null,
      approvedDate: app.certificates[0]?.issuedAt ?? null,
      expiresAt: app.certificates[0]?.expiresAt ?? null,
      certificateNumber: app.certificates[0]?.certificateNumber ?? null,
    }));

    return {
      data,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  // ─── findOne ─────────────────────────────────────────────────────────────────

  async findOne(id: string) {
    const application = await this.database.application.findFirst({
      where: { id, status: ApplicationStatus.APPROVED },
      select: {
        id: true,
        referenceNumber: true,
        title: true,
        type: true,
        principalInvestigator: true,
        studyDuration: true,
        studyStartDate: true,
        studyEndDate: true,
        methodology: true,
        submittedAt: true,
        destination: { select: { id: true, name: true } },
        certificates: {
          select: {
            certificateNumber: true,
            issuedAt: true,
            expiresAt: true,
            verificationToken: true,
          },
        },
        decisions: {
          select: { id: true, type: true, createdAt: true },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!application) {
      throw new NotFoundException(
        `Approved study with id "${id}" not found in registry.`,
      );
    }

    return {
      id: application.id,
      referenceNumber: application.referenceNumber,
      title: application.title,
      type: application.type,
      principalInvestigator: application.principalInvestigator,
      methodology: application.methodology,
      studyDuration: application.studyDuration,
      studyStartDate: application.studyStartDate,
      studyEndDate: application.studyEndDate,
      institution: application.destination?.name ?? null,
      approvedDate: application.certificates[0]?.issuedAt ?? null,
      expiresAt: application.certificates[0]?.expiresAt ?? null,
      certificateNumber: application.certificates[0]?.certificateNumber ?? null,
      verificationToken: application.certificates[0]?.verificationToken ?? null,
    };
  }

  // ─── verifyCertificate ────────────────────────────────────────────────────────

  async verifyCertificate(token: string) {
    return this.certificatesService.verify(token);
  }
}
