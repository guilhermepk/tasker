import { registerStartGoogleAuthIpc } from "./use-cases/start-auth/start-google-auth.ipc";

export function registerGoogleIpc(){
  registerStartGoogleAuthIpc();
}