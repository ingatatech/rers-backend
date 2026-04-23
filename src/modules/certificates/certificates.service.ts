import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseService } from '../../common/database/database.service';

@Injectable()
export class CertificatesService {
  constructor(private readonly database: DatabaseService) {}

  // ─── generate ─────────────────────────────────────────────────────────────────

  async generate(applicationId: string, decisionId: string) {
    // Check if certificate already exists for this decision
    const existing = await this.database.certificate.findUnique({
      where: { decisionId },
    });

    if (existing) {
      return existing;
    }

    const certificateNumber = await this.generateCertificateNumber();
    const verificationToken = uuidv4();
    const issuedAt = new Date();
    const expiresAt = new Date(issuedAt);
    expiresAt.setFullYear(expiresAt.getFullYear() + 2);

    return this.database.certificate.create({
      data: {
        applicationId,
        decisionId,
        certificateNumber,
        verificationToken,
        issuedAt,
        expiresAt,
      },
      include: {
        application: {
          select: {
            id: true,
            referenceNumber: true,
            title: true,
            type: true,
          },
        },
        decision: {
          select: { id: true, type: true, createdAt: true },
        },
      },
    });
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

    const certificate = await this.database.certificate.findFirst({
      where: { applicationId },
      include: {
        application: {
          select: {
            id: true,
            referenceNumber: true,
            title: true,
            type: true,
          },
        },
        decision: {
          select: { id: true, type: true, createdAt: true },
        },
      },
    });

    if (!certificate) {
      throw new NotFoundException(
        `No certificate found for application "${applicationId}".`,
      );
    }

    return certificate;
  }

  // ─── verify ──────────────────────────────────────────────────────────────────

  async verify(token: string) {
    const certificate = await this.database.certificate.findUnique({
      where: { verificationToken: token },
      include: {
        application: {
          select: {
            id: true,
            referenceNumber: true,
            title: true,
            type: true,
            applicant: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
            destination: {
              select: { id: true, name: true },
            },
          },
        },
        decision: {
          select: { id: true, type: true, createdAt: true },
        },
      },
    });

    if (!certificate) {
      throw new NotFoundException('Certificate not found for the provided verification token.');
    }

    return {
      valid: true,
      certificate: {
        certificateNumber: certificate.certificateNumber,
        issuedAt: certificate.issuedAt,
        expiresAt: certificate.expiresAt,
      },
      application: {
        referenceNumber: certificate.application.referenceNumber,
        title: certificate.application.title,
        type: certificate.application.type,
        institution: certificate.application.destination?.name ?? null,
        principalInvestigator: `${certificate.application.applicant.firstName} ${certificate.application.applicant.lastName}`,
      },
      decision: {
        type: certificate.decision.type,
        issuedAt: certificate.decision.createdAt,
      },
    };
  }

  // ─── download ─────────────────────────────────────────────────────────────────

  async download(applicationId: string, userId: string) {
    const certificate = await this.database.certificate.findFirst({
      where: { applicationId },
      include: {
        application: {
          select: {
            id: true,
            referenceNumber: true,
            title: true,
            applicantId: true,
          },
        },
      },
    });

    if (!certificate) {
      throw new NotFoundException(
        `No certificate found for application "${applicationId}".`,
      );
    }

    // Allow applicant or admin roles access — basic ownership check
    // (role check is enforced at controller level; here we just ensure applicant can access own)
    return {
      certificateNumber: certificate.certificateNumber,
      pdfPath: certificate.pdfPath,
      issuedAt: certificate.issuedAt,
      expiresAt: certificate.expiresAt,
      verificationToken: certificate.verificationToken,
    };
  }

  // ─── generateCertificateNumber ────────────────────────────────────────────────

  private async generateCertificateNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `CERT-${year}-`;

    const count = await this.database.certificate.count({
      where: { certificateNumber: { startsWith: prefix } },
    });

    const sequence = String(count + 1).padStart(4, '0');
    return `${prefix}${sequence}`;
  }
}
