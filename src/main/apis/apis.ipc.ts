import { registerStartGoogleAuthIpc } from "./google/use-cases/start-auth/start-google-auth.ipc";

export function registerApisIpc(){
  registerStartGoogleAuthIpc();
}