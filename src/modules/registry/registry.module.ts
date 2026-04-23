import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../common/database/database.module';
import { CertificatesModule } from '../certificates/certificates.module';
import { RegistryController } from './registry.controller';
import { RegistryService } from './registry.service';

@Module({
  imports: [DatabaseModule, CertificatesModule],
  controllers: [RegistryController],
  providers: [RegistryService],
  exports: [RegistryService],
})
export class RegistryModule {}
