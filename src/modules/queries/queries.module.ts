import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../common/database/database.module';
import { QueriesController } from './queries.controller';
import { QueriesService } from './queries.service';

@Module({
  imports: [DatabaseModule],
  controllers: [QueriesController],
  providers: [QueriesService],
  exports: [QueriesService],
})
export class QueriesModule {}
