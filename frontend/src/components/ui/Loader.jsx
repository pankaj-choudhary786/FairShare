import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

export const Loader = ({ size = 24, className }) => {
  return (
    <div className={cn("flex flex-col items-center justify-center space-y-3", className)}>
      <Loader2 size={size} className="animate-spin text-gold" />
      <span className="text-xs text-white/50 tracking-widest uppercase font-sans">Loading</span>
    </div>
  );
};
