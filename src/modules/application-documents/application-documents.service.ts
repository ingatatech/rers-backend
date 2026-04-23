import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CloudinaryService } from '../../common/cloudinary/cloudinary.service';
import { DatabaseService } from '../../common/database/database.service';
import { UploadDocumentDto } from './dto/upload-document.dto';

export interface MulterMemoryFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

/** MIME types allowed for upload. */
const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
]);

@Injectable()
export class ApplicationDocumentsService {
  constructor(
    private readonly database: DatabaseService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  // ─── uploadDocument ───────────────────────────────────────────────────────────

  async uploadDocument(
    file: MulterMemoryFile,
    applicationId: string,
    dto: UploadDocumentDto,
    userId: string,
  ) {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      throw new BadRequestException(
        `File type "${file.mimetype}" is not allowed. Permitted: pdf, doc, docx, jpg, png.`,
      );
    }

    const application = await this.database.application.findUnique({
      where: { id: applicationId },
      select: { id: true, applicantId: true },
    });

    if (!application) {
      throw new NotFoundException(
        `Application with id "${applicationId}" not found.`,
      );
    }

    const { url, publicId } = await this.cloudinary.upload(file.buffer, {
      folder: `rers/applications/${applicationId}`,
      originalName: file.originalname,
    });

    const document = await this.database.applicationDocument.create({
      data: {
        applicationId,
        fileName: file.originalname,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        path: url,
        cloudinaryPublicId: publicId,
        documentType: dto.documentType,
        version: dto.version ?? 1,
        uploadedById: userId,
      },
    });

    return document;
  }

  // ─── findByApplication ────────────────────────────────────────────────────────

  async findByApplication(applicationId: string) {
    const application = await this.database.application.findUnique({
      where: { id: applicationId },
      select: { id: true },
    });

    if (!application) {
      throw new NotFoundException(
        `Application with id "${applicationId}" not found.`,
      );
    }

    return this.database.applicationDocument.findMany({
      where: { applicationId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ─── findOne ─────────────────────────────────────────────────────────────────

  async findOne(applicationId: string, docId: string) {
    const document = await this.database.applicationDocument.findFirst({
      where: { id: docId, applicationId },
    });

    if (!document) {
      throw new NotFoundException(
        `Document with id "${docId}" not found on application "${applicationId}".`,
      );
    }

    return document;
  }

  // ─── deleteDocument ───────────────────────────────────────────────────────────

  async deleteDocument(
    applicationId: string,
    docId: string,
    userId: string,
  ) {
    const document = await this.findOne(applicationId, docId);

    if (document.uploadedById && document.uploadedById !== userId) {
      throw new ForbiddenException(
        'You can only delete documents you uploaded.',
      );
    }

    // Delete from Cloudinary if we have the public_id
    if (document.cloudinaryPublicId) {
      const resourceType = document.mimeType.startsWith('image/') ? 'image' : 'raw';
      await this.cloudinary.delete(document.cloudinaryPublicId, resourceType);
    }

    await this.database.applicationDocument.delete({ where: { id: docId } });

    return { message: `Document "${docId}" deleted.` };
  }

  // ─── getUrl ──────────────────────────────────────────────────────────────────

  async getUrl(applicationId: string, docId: string): Promise<string> {
    const document = await this.findOne(applicationId, docId);
    return document.path; // path now stores the Cloudinary secure URL
  }
}
