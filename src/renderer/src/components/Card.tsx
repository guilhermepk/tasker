import React from "react";

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`
        text-card-foreground
        flex flex-col gap-6
        mb-6 p-6
        bg-slate-800/50 backdrop-blur-sm
        shadow-lg
        border border-slate-700/50 rounded-[5px]
        ${className}
      `}
      {...props}
    />
  );
})

export default Card;