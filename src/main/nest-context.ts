import { INestApplicationContext } from '@nestjs/common';

let appContext: INestApplicationContext;

export const setAppContext = (ctx: INestApplicationContext): void => {
  appContext = ctx;
};

export const getAppContext = (): INestApplicationContext => {
  if (!appContext) throw new Error('Nest AppContext não inicializado');
  return appContext;
};