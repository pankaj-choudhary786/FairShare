import React from 'react';
import { cn } from '../../utils/cn';

export const Card = ({ children, variant = 'dark', className, ...props }) => {
  const variants = {
    dark: 'bg-charcoal/60 backdrop-blur-md border border-white/10 shadow-xl',
    light: 'bg-offwhite text-charcoal shadow-lg',
    bordered: 'bg-transparent border border-white/20',
  };

  return (
    <div
      className={cn(
        "rounded-xl overflow-hidden transition-all duration-300",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
