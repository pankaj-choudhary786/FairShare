import React from 'react';
import { Countdown } from '../ui/Countdown';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom';
import CountUp from 'react-countup';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { mockStats } from '../../utils/mockData';

const CountUpComponent = CountUp.default || CountUp;

export const PrizeTicker = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  
  // Set next draw date to end of current month
  const nextDrawDate = new Date();
  nextDrawDate.setMonth(nextDrawDate.getMonth() + 1);
  nextDrawDate.setDate(1);
  nextDrawDate.setHours(0,0,0,0);

  return (
    <section className="bg-charcoal border-y border-white/5 py-20 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gold/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="container mx-auto px-6 text-center relative z-10" ref={ref}>
        <span className="text-gold font-mono tracking-widest text-sm uppercase block mb-6">Current Jackpot</span>
        
        <div className="text-6xl md:text-8xl lg:text-9xl font-mono text-offwhite font-light tracking-tighter mb-12 drop-shadow-[0_0_15px_rgba(201,168,76,0.3)]">
          £
          {isInView ? (
            <CountUpComponent start={0} end={mockStats.prizePool} duration={2.5} separator="," />
          ) : "0"}
        </div>
        
        <div className="flex flex-col items-center mb-10">
          <span className="text-sm text-white/50 tracking-wider uppercase mb-4">Next draw in:</span>
          <Countdown targetDate={nextDrawDate.toISOString()} className="justify-center" />
        </div>
        
        <Link to="/signup">
          <Button variant="primary" size="lg" className="w-full sm:w-auto min-w-[200px] text-lg mt-4 shadow-[0_0_20px_rgba(201,168,76,0.2)]">Secure Your Entry</Button>
        </Link>
      </div>
    </section>
  );
};
