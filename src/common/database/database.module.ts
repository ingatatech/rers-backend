import { Global, Module } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../config/db';
import { DatabaseService } from './database.service';

@Global()
@Module({
  providers: [
    {
      provide: DataSource,
      useFactory: async () => {
        if (!AppDataSource.isInitialized) {
          await AppDataSource.initialize();
        }

        return AppDataSource;
      },
    },
    DatabaseService,
  ],
  exports: [DataSource, DatabaseService],
})
export class DatabaseModule {}
