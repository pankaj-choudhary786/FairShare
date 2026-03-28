import React from 'react';
import { cn } from '../../utils/cn';
import { Check } from 'lucide-react';

export const StepIndicator = ({ currentStep, totalSteps = 3, className }) => {
  return (
    <div className={cn("flex flex-col items-center w-full", className)}>
      <div className="flex items-center w-full max-w-sm justify-between relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-white/10 z-0"></div>
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-gold z-0 transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        ></div>
        
        {Array.from({ length: totalSteps }).map((_, i) => {
          const stepNum = i + 1;
          const isActive = stepNum === currentStep;
          const isCompleted = stepNum < currentStep;
          
          return (
            <div 
              key={stepNum}
              className={cn(
                "relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors duration-300",
                isActive ? "border-gold bg-charcoal text-gold" : 
                isCompleted ? "border-gold bg-gold text-charcoal" : 
                "border-white/20 bg-charcoal text-white/40"
              )}
            >
              {isCompleted ? <Check className="w-4 h-4" /> : <span className="text-sm font-medium">{stepNum}</span>}
            </div>
          );
        })}
      </div>
      <div className="flex w-full max-w-sm justify-between mt-3 px-1 text-xs text-white/50 font-medium">
        <span>Details</span>
        <span>Plan</span>
        <span>Charity</span>
      </div>
    </div>
  );
};
