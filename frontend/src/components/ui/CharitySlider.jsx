import React from 'react';
import { cn } from '../../utils/cn';
import { calculateCharityContribution } from '../../utils/helpers';

export const CharitySlider = ({ 
  percentage, 
  setPercentage, 
  planPrice = 9.99,
  min = 10, 
  max = 50,
  className 
}) => {
  
  const contribution = calculateCharityContribution(planPrice, percentage);
  const fillWidth = ((percentage - min) / (max - min)) * 100;

  return (
    <div className={cn("w-full space-y-4", className)}>
      <div className="flex justify-between items-end">
        <div>
          <span className="text-3xl font-playfair text-gold">{percentage}%</span>
          <span className="text-sm text-white/50 ml-2">contribution</span>
        </div>
        <div className="text-right">
          <span className="block text-sm text-white/50 mb-1">Monthly Impact</span>
          <span className="text-xl font-mono text-offwhite">£{contribution}</span>
        </div>
      </div>
      
      <div className="relative pt-2 pb-2">
        <input 
          type="range" 
          min={min} 
          max={max} 
          value={percentage}
          onChange={(e) => setPercentage(Number(e.target.value))}
          className="w-full absolute z-20 opacity-0 cursor-pointer h-full"
        />
        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden relative z-10 pointer-events-none">
          <div 
            className="h-full bg-gold rounded-full transition-all duration-150"
            style={{ width: `${fillWidth}%` }}
          />
        </div>
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-offwhite border-2 border-gold rounded-full shadow-[0_0_10px_rgba(201,168,76,0.5)] z-10 pointer-events-none transition-all duration-150"
          style={{ left: `calc(${fillWidth}% - 10px)` }}
        />
      </div>
      <div className="flex justify-between text-xs text-white/40 font-medium px-1">
        <span>Minimum (10%)</span>
        <span>Maximum (50%)</span>
      </div>
    </div>
  );
};
