import { ReactNode } from "react";

export default function CancelButton({
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
      className={`
        h-14
        flex items-center gap-2.5
        px-5 py-3
        rounded-xl
        transition-all duration-300
        hover:scale-[1.1] cursor-pointer
        active:scale-[0.98]
        bg-zinc-800
        hover:bg-red-600
        text-zinc-300
        shadow-sm
      `}
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