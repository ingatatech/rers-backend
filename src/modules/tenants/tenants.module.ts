import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../common/database/database.module';
import { UserProvisioningModule } from '../../common/user-provisioning/user-provisioning.module';
import { TenantsController } from './tenants.controller';
import { TenantsService } from './tenants.service';

@Module({
  imports: [DatabaseModule, UserProvisioningModule],
  controllers: [TenantsController],
  providers: [TenantsService],
  exports: [TenantsService],
})
export class TenantsModule {}
