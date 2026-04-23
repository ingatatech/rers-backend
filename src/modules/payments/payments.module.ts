import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../common/database/database.module';
import { ReceiptsModule } from '../receipts/receipts.module';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

@Module({
  imports: [DatabaseModule, ReceiptsModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
