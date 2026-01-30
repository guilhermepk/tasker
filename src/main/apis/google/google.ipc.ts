import { registerIsGoogleAuthenticatedIpc } from "./use-cases/is-authenticated/is-google-authenticated.ipc";
import { registerStartGoogleAuthIpc } from "./use-cases/start-auth/start-google-auth.ipc";

export function registerGoogleIpc(){
  registerStartGoogleAuthIpc();
  registerIsGoogleAuthenticatedIpc();
}