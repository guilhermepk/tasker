import React from 'react'

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      data-slot="input"
      className={`        
        flex

        h-12
        w-full
        py-1 px-4
        border border-input outline-none
        rounded-[10px]

        bg-input-background

        md:text-sm

        active:border-purple-500
        focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none
        
        hover:border hover:border-purple-500

        transition-[color,box-shadow]
        ${className}
      `}
      {...props}
    />
  )
})
Input.displayName = 'Input'
