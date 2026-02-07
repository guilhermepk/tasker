import { Toast, toast } from "react-hot-toast";
import { Monitor, AlertCircle, X } from 'lucide-react';
import Button from "./Button";
import CancelButton from "./CancelButton";
import GoogleDriveIcon from "@renderer/common/icons/GoogleDriveIcon";

export default function ConflictToast({
  t
}: { t: Toast }) {
  return (
    <div
      className={`${t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-xl w-full bg-zinc-900 shadow-2xl rounded-2xl pointer-events-auto overflow-hidden`}
    >
      <ToastHeader />

      <ToastContent t={t} />
    </div>
  );
}


function ToastHeader() {
  return (
    <div className="px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          <AlertCircle className="h-10 w-10 text-amber-500" />
        </div>
        <div>
          <h3 className="text-white font-semibold text-lg">
            Conflito Detectado
          </h3>
          <p className="text-amber-50 text-sm mt-0.5">
            Ação necessária para resolver
          </p>
        </div>
      </div>
    </div>
  );
}

function ToastContent({ t }: { t: Toast }) {
  return (
    <div className="p-6">
      <div className="space-y-4">
        <ContextMessage />

        <ActionMessage />

        <ButtonsSection t={t} />
      </div>
    </div>
  );
}

const ContextMessage = () => (
  <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
    Foram enviadas alterações à nuvem ao mesmo tempo em que foram feitas alterações locais.
  </p>
)

const ActionMessage = () => (
  <div className="bg-amber-500/50 border border-amber-900/50 rounded-xl p-4">
    <p className="text-amber-200 text-sm">
      <strong className="font-semibold">Por favor, escolha qual versão deseja manter:</strong>
    </p>
  </div>
);

function ButtonsSection({ t }: { t: Toast }) {
  function handleLocalChoice() {

  }

  function handleCloudChoice() { }

  return (
    <>
      <div className="grid grid-cols-2 gap-3 pt-2">
        <Button
          text="Local"
          icon={<Monitor className="h-8 w-8 text-white" />}
          iconBgColor="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950"
          onClick={handleLocalChoice}
        />

        <Button
          text="Nuvem"
          icon={<GoogleDriveIcon />}
          iconBgColor="bg-gradient-to-r from-blue-600 to-blue-900"
          onClick={handleCloudChoice}
        />
      </div>

      <div className="pt-1 flex items-center justify-center">
        <CancelButton
          text="Cancelar sincronização"
          icon={<X className="h-7 w-7" />}
          onClick={() => {
            toast.dismiss(t.id);
          }}
        />
      </div>
    </>
  );
}