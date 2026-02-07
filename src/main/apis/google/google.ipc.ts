import { registerDownloadCloudDatabaseFileIpc } from "./use-cases/download-cloud-database-file/download-cloud-database-file.ipc";
import { registerIsGoogleAuthenticatedIpc } from "./use-cases/is-authenticated/is-google-authenticated.ipc";
import { registerLogoutGoogleIpc } from "./use-cases/logout-google/logout-google.ipc.ipc";
import { registerStartGoogleAuthIpc } from "./use-cases/start-auth/start-google-auth.ipc";
import { registerSyncDatabaseIpc } from "./use-cases/sync-database/sync-database.ipc";
import { registerUpdateCloudDatabaseFileIpc } from "./use-cases/update-cloud-database-file/update-cloud-database-file.ipc";

export function registerGoogleIpc() {
  registerStartGoogleAuthIpc();
  registerIsGoogleAuthenticatedIpc();
  registerLogoutGoogleIpc();
  registerSyncDatabaseIpc();
  registerUpdateCloudDatabaseFileIpc();
  registerDownloadCloudDatabaseFileIpc();
}