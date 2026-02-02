import { registerIsGoogleAuthenticatedIpc } from "./use-cases/is-authenticated/is-google-authenticated.ipc";
import { registerLogoutGoogleIpc } from "./use-cases/logout-google/logout-google.ipc.ipc";
import { registerStartGoogleAuthIpc } from "./use-cases/start-auth/start-google-auth.ipc";
import { registerSyncDatabaseIpc } from "./use-cases/sync-database/sync-database.ipc";

export function registerGoogleIpc(){
  registerStartGoogleAuthIpc();
  registerIsGoogleAuthenticatedIpc();
  registerLogoutGoogleIpc();
  registerSyncDatabaseIpc();
}