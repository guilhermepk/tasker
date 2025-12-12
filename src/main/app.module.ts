import { Module, OnModuleInit } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule implements OnModuleInit {
  onModuleInit() {
    console.log('Iniciado') 
  }
}