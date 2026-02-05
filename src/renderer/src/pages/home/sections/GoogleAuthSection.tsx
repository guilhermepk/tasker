import formatIpcError from "@renderer/utils/format-ipc-error";
import { IpcResponse } from "@shared/models/interfaces/ipc-response.interface";
import { IsGoogleAuthAuthenticatedResponse } from "@shared/models/responses/google/is-google-auth-authenticated.response";
import { SyncDatabaseResponse } from "@shared/models/responses/google/sync-database.response";
import { useEffect, useState } from "react";
import { toast } from 'react-hot-toast';
import ConflictToast from "./components/ConflictToast";
import ConflictToast2 from "./components/c2";

interface props {
  onSyncDatabase?: () => void;
}

export default function GoogleAuthSection({ onSyncDatabase }: props) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    async function fetchIsAuthenticated(): Promise<void> {
      const response: IpcResponse<IsGoogleAuthAuthenticatedResponse> = await window.api.google.isAuthenticated();

      if (response.success) {
        setIsAuthenticated(response.data.isAuthenticated);
        setEmail(response.data.email);
      } else {
        window.alert(formatIpcError(response.error));
      }
    }

    fetchIsAuthenticated();
  }, []);

  async function handleLogout() {
    const response: IpcResponse<void> = await window.api.google.logout();

    if (response.success) {
      setIsAuthenticated(false);
      setEmail(null);
    } else {
      window.alert(formatIpcError(response.error));
    }
  }

  async function handleAuth() {
    const response: IpcResponse<null> = await window.api.google.startAuth();

    if (response.success) {

    } else {
      window.alert(formatIpcError(response.error));
    }
  }

  async function handleSyncDatabase() {
    const response: IpcResponse<SyncDatabaseResponse> = await window.api.google.syncDatabase();

    if (response.success) {
      if (response.data.finished) {
        window.alert("Sincronização concluída com sucesso!");
        onSyncDatabase?.();
      }
    } else {
      window.alert(formatIpcError(response.error));
    }
  }

  function subscribeToAuthSuccess() {
    window.api.google.onAuthSuccess((payload: { email: string | null }) => {
      setIsAuthenticated(true);
      setEmail(payload.email);
    });
  }

  function subscribeToSyncConflict() {
    function handleSyncConflict() {
      toast.custom(
        (t) => <ConflictToast t={t} />,
        { duration: Infinity }
      );
    }

    window.api.google.onSyncConflict(handleSyncConflict);
  }

  useEffect(() => {
    subscribeToAuthSuccess();
    subscribeToSyncConflict();

    toast.custom(
      (t) => <ConflictToast t={t} />,
      { duration: Infinity }
    );

    toast.custom(
      (t) => <ConflictToast2 t={t} />,
      { duration: Infinity }
    );
  }, []);

  return (
    <div className="flex items-center justify-center gap-2">
      {isAuthenticated
        ? (
          <>
            {email
              ? (
                <div className="flex flex-col items-center">
                  <p>Conectado como:</p>
                  <p className="font-bold">{email}</p>
                </div>
              ) : (<p>Email não encontrado</p>)
            }

            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
            >
              Desconectar do Google
            </button>

            <button
              onClick={handleSyncDatabase}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
            >
              Sincronizar com o Google
            </button>
          </>
        )
        : (
          <button
            onClick={handleAuth}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Autenticar com Google
          </button>
        )
      }
    </div >
  );
}