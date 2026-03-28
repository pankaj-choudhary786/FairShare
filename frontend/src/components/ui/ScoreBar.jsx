import React, { useEffect, useState } from 'react';
import { cn } from '../../utils/cn';

export const ScoreBar = ({ score, maxScore = 45, className }) => {
  const [width, setWidth] = useState(0);
  
  useEffect(() => {
    // Small delay to allow mount animation
    const timer = setTimeout(() => {
      const percentage = Math.min((score / maxScore) * 100, 100);
      setWidth(percentage);
    }, 100);
    return () => clearTimeout(timer);
  }, [score, maxScore]);

  // Color logic based on requirements: low/mid/high range
  const getColorClass = () => {
    if (score >= 36) return 'bg-gold shadow-[0_0_10px_rgba(201,168,76,0.5)]';
    if (score >= 20) return 'bg-offwhite';
    return 'bg-sage';
  };

  return (
    <div className={cn("flex flex-col w-full gap-1.5", className)}>
      <div className="flex justify-between items-end">
        <span className="text-xs font-medium text-white/60 tracking-wider">SCORE</span>
        <span className="font-mono text-lg text-offwhite">{score} <span className="text-sm text-white/40">/ {maxScore}</span></span>
      </div>
      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
        <div 
          className={cn("h-full rounded-full transition-all duration-1000 ease-out", getColorClass())}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
};
