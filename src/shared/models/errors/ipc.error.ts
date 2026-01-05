export class IpcError {
  constructor(
    readonly code: number,
    readonly message: string,
    readonly details?: string[]
  ) { }
}