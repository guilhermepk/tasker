import { ReactNode } from "react";

export default function Button({
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