import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { app } from 'electron';
import path from 'path';

@Injectable()
export class TypeOrmConfigService {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'sqlite',
      database: path.join(app.getPath('userData'), 'tasker.db'),
      synchronize: true,
      autoLoadEntities: true,
    };
  }
}