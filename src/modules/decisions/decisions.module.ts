import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../common/database/database.module';
import { CertificatesModule } from '../certificates/certificates.module';
import { DecisionsController } from './decisions.controller';
import { DecisionsService } from './decisions.service';

@Module({
  imports: [DatabaseModule, CertificatesModule],
  controllers: [DecisionsController],
  providers: [DecisionsService],
  exports: [DecisionsService],
})
export class DecisionsModule {}
