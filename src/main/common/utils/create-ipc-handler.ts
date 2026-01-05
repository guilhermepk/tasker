import { plainToInstance } from "class-transformer";
import { validateOrReject, ValidationError } from "class-validator";
import { ipcMain, IpcMainInvokeEvent } from "electron";
import { IpcResponse } from "../../../shared/models/interfaces/ipc-response.interface";
import { IpcError } from "../../../shared/models/errors/ipc.error";
import { INestApplicationContext } from "@nestjs/common";
import { handleError } from './try-catch';
import { getAppContext } from "../../nest-context";
import { IpcGuard } from "../../guards/models/types/ipc-guard";
import { useGuards } from "../../guards/use-guards";
import { ClassConstructor } from "../types/class-constructor.type";
import { BadRequestError } from '@shared/models/errors/bad-request.error'

type Handler<Dto, Response, UseCase> =
  | (() => IpcResponse<Response> | Promise<IpcResponse<Response>>)
  | ((payload: Dto) => IpcResponse<Response> | Promise<IpcResponse<Response>>)
  | ((useCase: UseCase) => IpcResponse<Response> | Promise<IpcResponse<Response>>)
  | ((payload: Dto, useCase: UseCase) => IpcResponse<Response> | Promise<IpcResponse<Response>>);

type Options<Dto, UseCase> = {
  dtoClass?: ClassConstructor<Dto>,
  useCaseClass?: ClassConstructor<UseCase>,
  guards?: Array<IpcGuard>,
};

// --------------------
// Overloads
// --------------------
export default function createIpcHandler<Response>(
  channel: string,
  handler: (() => IpcResponse<Response>) | (() => Promise<IpcResponse<Response>>),
): void;

export default function createIpcHandler<Dto, Response>(
  channel: string,
  handler: ((payload: Dto) => IpcResponse<Response>) | ((payload: Dto) => Promise<IpcResponse<Response>>),
  options: { dtoClass: ClassConstructor<Dto>, guards?: Array<IpcGuard>, }
): void;

export default function createIpcHandler<Response, UseCase>(
  channel: string,
  handler: ((useCase: UseCase) => IpcResponse<Response>) | ((useCase: UseCase) => Promise<IpcResponse<Response>>),
  options: { useCaseClass: ClassConstructor<UseCase>, guards?: Array<IpcGuard>, }
): void;

export default function createIpcHandler<Dto, Response, UseCase>(
  channel: string,
  handler: ((payload: Dto, useCase: UseCase) => IpcResponse<Response>) | ((payload: Dto, useCase: UseCase) => Promise<IpcResponse<Response>>),
  options: { dtoClass: ClassConstructor<Dto>, useCaseClass: ClassConstructor<UseCase>, guards?: Array<IpcGuard>, }
): void;

// --------------------
// Implementação
// --------------------
export default function createIpcHandler<Dto, Response, UseCase>(
  channel: string,
  handler: Handler<Dto, Response, UseCase>,
  options?: Options<Dto, UseCase>
): void {
  const { dtoClass, useCaseClass, guards } = options || {};

  async function finalHandler(_: IpcMainInvokeEvent, rawPayload: any = {}): Promise<IpcResponse<Response>> {
    // Guards
    if (guards) {
      const guardResponse: IpcResponse<never> | void = await useGuards(guards);
      if (guardResponse) return guardResponse;
    }

    let dtoInstance: Dto | undefined;
    let useCaseInstance: UseCase | undefined;

    // DTO
    if (dtoClass) {
      dtoInstance = plainToInstance(dtoClass, rawPayload);

      try {
        await validateOrReject(dtoInstance as object);
      } catch (error: any) {
        if (Array.isArray(error) && error[0] instanceof ValidationError) {
          return {
            success: false,
            error: new BadRequestError(
              "Campos inválidos!",
              (error as ValidationError[]).map(e => Object.values(e.constraints ?? {})).flat()
            )
          };
        }
        return {
          success: false,
          error: new BadRequestError("Erro de validação!", [error.message ?? String(error)])
        };
      }
    }

    // UseCase
    if (useCaseClass) {
      try {
        const appContext: INestApplicationContext = getAppContext();
        useCaseInstance = appContext.get(useCaseClass, { strict: false });
      } catch (err: any) {
        return {
          success: false,
          error: new IpcError(500, "Erro interno!", [err.message ?? String(err)])
        };
      }
    }

    try {
      // Decide a chamada correta
      if (dtoInstance && useCaseInstance) {
        return await (handler as (payload: Dto, useCase: UseCase) => Promise<IpcResponse<Response>>)(dtoInstance, useCaseInstance);
      } else if (dtoInstance) {
        return await (handler as (payload: Dto) => Promise<IpcResponse<Response>>)(dtoInstance);
      } else if (useCaseInstance) {
        return await (handler as (useCase: UseCase) => Promise<IpcResponse<Response>>)(useCaseInstance);
      } else {
        return await (handler as () => Promise<IpcResponse<Response>>)();
      }
    } catch (error: any) {
      return handleError(error, { uncaughtErrorMessage: `Erro interno`, handleType: 'return' });
    }
  }

  ipcMain.handle(channel, finalHandler);
}