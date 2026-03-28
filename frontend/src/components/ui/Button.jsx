import React from 'react';
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className,
  disabled,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-sans font-medium transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-charcoal rounded-md";
  
  const variants = {
    primary: "bg-gold text-charcoal hover:bg-[#D4B55E] focus:ring-gold shadow-[0_0_15px_rgba(201,168,76,0.15)] hover:shadow-[0_0_20px_rgba(201,168,76,0.3)]",
    secondary: "bg-transparent border border-white/20 text-offwhite hover:bg-white/5 hover:border-white/40 focus:ring-white/50",
    danger: "bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500/20 focus:ring-red-500",
    muted: "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80 focus:ring-white/20",
    ghost: "bg-transparent text-white/70 hover:text-white hover:bg-white/5 focus:ring-white/20"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        (disabled || isLoading) ? "opacity-50 cursor-not-allowed pointer-events-none" : "",
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <Loader2 className={cn("animate-spin", size === 'sm' ? "w-4 h-4 mr-2" : "w-5 h-5 mr-3")} />
      )}
      {children}
    </button>
  );
};
