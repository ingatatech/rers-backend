import { Module } from '@nestjs/common';
import { CloudinaryService } from '../../common/cloudinary/cloudinary.service';
import { DatabaseModule } from '../../common/database/database.module';
import { ApplicationDocumentsController } from './application-documents.controller';
import { ApplicationDocumentsService } from './application-documents.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ApplicationDocumentsController],
  providers: [ApplicationDocumentsService, CloudinaryService],
  exports: [ApplicationDocumentsService],
})
export class ApplicationDocumentsModule {}
