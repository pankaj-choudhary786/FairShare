import React from 'react';
import { cn } from '../../utils/cn';

export const Badge = ({ children, variant = 'sage', className }) => {
  const variants = {
    active: 'bg-green-500/10 text-green-400 border border-green-500/20',
    inactive: 'bg-red-500/10 text-red-400 border border-red-500/20',
    pending: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
    gold: 'bg-gold/10 text-gold border border-gold/20',
    sage: 'bg-sage/10 text-sage border border-sage/20',
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium font-sans uppercase tracking-wider",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
};
