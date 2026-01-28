import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './config/sqlite.config';
import { TasksModule } from './tasks/tasks.module';
import { ApisModule } from './apis/apis.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      inject: [TypeOrmConfigService],
    }),
    TasksModule,
    ApisModule,
  ],
})
export class AppModule {}