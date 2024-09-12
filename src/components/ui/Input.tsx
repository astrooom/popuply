import * as React from "react"
import { cn } from "@/utils/cn"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "ghost"
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, variant = "default", ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex w-full bg-background px-3 py-2 text-sm placeholder:text-muted-foreground",
        variant === "default" &&
          "h-10 rounded-md border border-input ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        variant === "ghost" &&
          "border-0 outline-none ring-0 ring-offset-0 focus:outline-none focus:ring-0 focus:ring-offset-0 hover:outline-none hover:ring-0 hover:ring-offset-0",
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }
