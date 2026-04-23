import { Module } from '@nestjs/common';
import { UserProvisioningModule } from '../../common/user-provisioning/user-provisioning.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [UserProvisioningModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
