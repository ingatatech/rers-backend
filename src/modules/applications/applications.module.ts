import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../common/database/database.module';
import { WorkflowsModule } from '../workflows/workflows.module';
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';

@Module({
  imports: [DatabaseModule, WorkflowsModule],
  controllers: [ApplicationsController],
  providers: [ApplicationsService],
  exports: [ApplicationsService],
})
export class ApplicationsModule {}
