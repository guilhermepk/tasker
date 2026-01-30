import formatIpcError from "@renderer/utils/format-ipc-error";
import { IpcResponse } from "@shared/models/interfaces/ipc-response.interface";
import { IsGoogleAuthAuthenticatedResponse } from "@shared/models/responses/google/is-google-auth-authenticated.response";
import { useEffect, useState } from "react";

export default function GoogleAuthSection() {
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
    window.alert('Ainda não implementado');
  }

  async function handleAuth() {
    const response = await window.api.google.startAuth();

    if (response.success) {

    } else {
      window.alert(formatIpcError(response.error));
    }
  }

  useEffect(() => {
    window.api.google.onAuthSuccess((payload: { email: string | null }) => {
      console.log('sinal recebido');

      setIsAuthenticated(true);
      setEmail(payload.email);
    });
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