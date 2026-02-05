import { Toast, toast } from "react-hot-toast";
import { Monitor, AlertCircle, X } from 'lucide-react';
import { ReactNode } from "react";

function GoogleDriveIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="-13.095 -19.5 113.49 117">
      <path d="M6.6 66.85l3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3L27.5 53H0c0 1.55.4 3.1 1.2 4.5z" fill="#0066da" />
      <path d="M43.65 25L29.9 1.2c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44A9.06 9.06 0 000 53h27.5z" fill="#00ac47" />
      <path d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75L86.1 57.5c.8-1.4 1.2-2.95 1.2-4.5H59.798l5.852 11.5z" fill="#ea4335" />
      <path d="M43.65 25L57.4 1.2C56.05.4 54.5 0 52.9 0H34.4c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d" />
      <path d="M59.8 53H27.5L13.75 76.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc" />
      <path d="M73.4 26.5l-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3L43.65 25 59.8 53h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00" />
    </svg>
  );
}

function Button({
  text,
  onClick,
  icon,
  iconBgColor
}: { text: string, onClick?: () => void, icon?: ReactNode, iconBgColor?: string }) {
  return (
    <button
      className="group relative h-16 rounded-2xl bg-zinc-800 font-semibold text-zinc-300 cursor-pointer"
      type="button"
      onClick={onClick}
    >
      <div
        className={`absolute left-1 top-1 z-10 flex h-14 w-3/10 items-center justify-center rounded-xl ${iconBgColor} duration-500 group-hover:w-34/35`}
      >
        {icon}
      </div>

      <p className="translate-x-5 transition-all duration-500 group-hover:text-white font-medium">
        {text}
      </p>
    </button>
  );
};

function CancelButton({
  text,
  onClick,
  icon,
}: {
  text: string;
  onClick?: () => void;
  icon?: ReactNode;
}) {
  return (
    <button
      className={`h-14 flex items-center gap-2.5 px-5 py-3 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] bg-zinc-800 hover:bg-red-600 text-zinc-300 shadow-sm cursor-pointer`}
      type="button"
      onClick={onClick}
    >
      <div className="flex items-center justify-center">
        {icon}
      </div>
      <span className="font-medium">{text}</span>
    </button>
  );
}

export default function ConflictToast2({
  t
}: { t: Toast }) {
  return (
    <div
      className={`${t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-xl w-full bg-zinc-900 shadow-2xl rounded-2xl pointer-events-auto overflow-hidden`}
    >
      {/* Header com gradiente */}
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

      {/* Conteúdo */}
      <div className="p-6">
        <div className="space-y-4">
          <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
            Foram enviadas alterações à nuvem ao mesmo tempo em que foram feitas alterações locais.
          </p>

          <div className="bg-amber-500/50 border border-amber-900/50 rounded-xl p-4">
            <p className="text-amber-200 text-sm">
              <strong className="font-semibold">Por favor, escolha qual versão deseja manter:</strong>
            </p>
          </div>

          {/* Botões de ação */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button
              text="Local"
              icon={<Monitor className="h-8 w-8 text-white" />}
              iconBgColor="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950"
            />

            <Button
              text="Nuvem"
              icon={<GoogleDriveIcon />}
              iconBgColor="bg-gradient-to-r from-blue-600 to-blue-900"
            />
          </div>

          {/* Botão cancelar */}
          <div className="pt-1 flex items-center justify-center">
            <CancelButton
              text="Cancelar sincronização"
              icon={<X className="h-7 w-7" />}
              onClick={() => {
                toast.dismiss(t.id);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
