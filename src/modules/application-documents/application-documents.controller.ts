import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Redirect,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { ApplicationDocumentsService } from './application-documents.service';
import type { MulterMemoryFile } from './application-documents.service';
import { UploadDocumentDto } from './dto/upload-document.dto';

@ApiTags('application-documents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('applications/:id/documents')
export class ApplicationDocumentsController {
  constructor(
    private readonly documentsService: ApplicationDocumentsService,
  ) {}

  // ─── POST /applications/:id/documents ─────────────────────────────────────────

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file', 'documentType'],
      properties: {
        file: { type: 'string', format: 'binary' },
        documentType: { type: 'string' },
        version: { type: 'integer' },
      },
    },
  })
  @ApiOperation({ summary: 'Upload a document for an application (stored on Cloudinary)' })
  @ApiParam({ name: 'id', description: 'Application UUID' })
  @ApiResponse({ status: 201, description: 'Document uploaded.' })
  @ApiResponse({ status: 400, description: 'Invalid file type or missing file.' })
  @ApiResponse({ status: 404, description: 'Application not found.' })
  uploadDocument(
    @Param('id') id: string,
    @UploadedFile() file: MulterMemoryFile,
    @Body() dto: UploadDocumentDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.documentsService.uploadDocument(file, id, dto, user.id);
  }

  // ─── GET /applications/:id/documents ──────────────────────────────────────────

  @Get()
  @ApiOperation({ summary: 'List all documents for an application' })
  @ApiParam({ name: 'id', description: 'Application UUID' })
  @ApiResponse({ status: 200, description: 'Array of documents returned.' })
  @ApiResponse({ status: 404, description: 'Application not found.' })
  findByApplication(@Param('id') id: string) {
    return this.documentsService.findByApplication(id);
  }

  // ─── GET /applications/:id/documents/:docId ───────────────────────────────────

  @Get(':docId')
  @Redirect()
  @ApiOperation({ summary: 'Redirect to the Cloudinary URL for a document' })
  @ApiParam({ name: 'id', description: 'Application UUID' })
  @ApiParam({ name: 'docId', description: 'Document UUID' })
  @ApiResponse({ status: 302, description: 'Redirects to the Cloudinary file URL.' })
  @ApiResponse({ status: 404, description: 'Document not found.' })
  async getDocument(
    @Param('id') id: string,
    @Param('docId') docId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    const url = await this.documentsService.getUrl(id, docId);
    return { url, statusCode: 302 };
  }

  // ─── DELETE /applications/:id/documents/:docId ────────────────────────────────

  @Delete(':docId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a document by id (also removes from Cloudinary)' })
  @ApiParam({ name: 'id', description: 'Application UUID' })
  @ApiParam({ name: 'docId', description: 'Document UUID' })
  @ApiResponse({ status: 200, description: 'Document deleted.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Document not found.' })
  deleteDocument(
    @Param('id') id: string,
    @Param('docId') docId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.documentsService.deleteDocument(id, docId, user.id);
  }
}
