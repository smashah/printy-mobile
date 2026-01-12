"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "./input";
import { cn } from "../lib/utils";

type InputPasswordProps = React.ComponentProps<"input">;

export const InputPassword = ({ className, ...props }: InputPasswordProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={cn("relative")}>
      <Input
        type={showPassword ? "text" : "password"}
        className={cn(className)}
        {...props}
      />
      <button
        type="button"
        className={cn(
          "appearance-none",
          "absolute right-3 top-1/2 -translate-y-1/2",
          "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
          "transition-colors duration-200",
        )}
        onClick={() => setShowPassword(!showPassword)}
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
};

InputPassword.displayName = "InputPassword";
