import React, { useState, useEffect } from 'react';
import { cn } from '../../utils/cn';

export const Countdown = ({ targetDate, className }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      let newTimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
      
      if (difference > 0) {
        newTimeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        };
      }
      return newTimeLeft;
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const pad = (num) => String(num).padStart(2, '0');

  return (
    <div className={cn("flex items-center gap-2 sm:gap-4 font-mono text-3xl md:text-5xl text-gold", className)}>
      <div className="flex flex-col items-center w-12 sm:w-16">
        <span>{pad(timeLeft.days)}</span>
        <span className="text-[10px] sm:text-xs text-white/50 tracking-widest mt-1 uppercase font-sans">Days</span>
      </div>
      <span className="text-white/20 -mt-6">:</span>
      <div className="flex flex-col items-center w-12 sm:w-16">
        <span>{pad(timeLeft.hours)}</span>
        <span className="text-[10px] sm:text-xs text-white/50 tracking-widest mt-1 uppercase font-sans">Hrs</span>
      </div>
      <span className="text-white/20 -mt-6">:</span>
      <div className="flex flex-col items-center w-12 sm:w-16">
        <span>{pad(timeLeft.minutes)}</span>
        <span className="text-[10px] sm:text-xs text-white/50 tracking-widest mt-1 uppercase font-sans">Min</span>
      </div>
      <span className="text-white/20 -mt-6">:</span>
      <div className="flex flex-col items-center w-12 sm:w-16">
        <span>{pad(timeLeft.seconds)}</span>
        <span className="text-[10px] sm:text-xs text-white/50 tracking-widest mt-1 uppercase font-sans">Sec</span>
      </div>
    </div>
  );
};
