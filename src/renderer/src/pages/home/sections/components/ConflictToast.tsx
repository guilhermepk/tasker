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
      className="group relative h-14 w-40 rounded-2xl bg-white text-xl font-semibold text-black shadow-md cursor-pointer"
      type="button"
      onClick={onClick}
    >
      <div
        className={`absolute left-1 top-1 z-10 flex h-12 w-3/10 items-center justify-center rounded-xl ${iconBgColor} duration-500 group-hover:w-17/18`}
      >
        {icon}
      </div>

      <p className="translate-x-5 transition-all duration-500 group-hover:text-white">
        {text}
      </p>
    </button>
  );
};

export default function ConflictToast({
  t
}: { t: Toast }) {
  return (
    <div
      className={`${t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-white dark:bg-zinc-900 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 border border-zinc-200 dark:border-zinc-800`}
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <AlertCircle className="h-10 w-10 text-amber-500" />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-[16px] text-white">
              <b className="font-bold">Conflito detectado</b>
            </p>
            <p className="mt-4 text-sm text-white">
              Foram enviadas alterações à nuvem, ao mesmo tempo em que foram feitas alterações locais.
            </p>

            <p className="mt-4 text-sm text-white">
              Por favor, escolha qual você deseja manter.
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <Button
                text="Local"
                icon={<Monitor className="h-8 w-8 text-white" />}
                iconBgColor="bg-slate-900"
              />

              <Button
                text="Nuvem"
                icon={<GoogleDriveIcon />}
                iconBgColor="bg-[#255696]"
              />

              <Button
                text="Cancelar"
                icon={<X className="h-8 w-8 text-white" />}
                iconBgColor="bg-red-600"
                onClick={() => {
                  toast.dismiss(t.id);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}