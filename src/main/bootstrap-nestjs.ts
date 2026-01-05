import { INestApplicationContext, Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { setAppContext } from "./nest-context";
import { registerNestAppIpc } from "./app.ipc";

export async function bootstrapNestJS(): Promise<void> {
  const logger = new Logger('Tasker');

  const appContext: INestApplicationContext = await NestFactory.createApplicationContext(AppModule);
  setAppContext(appContext);
  registerNestAppIpc();
  logger.log('NestJS iniciado');
}