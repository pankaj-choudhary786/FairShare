import React from 'react';
import { DrawResultCard } from '../ui/DrawResultCard';
import { mockWinners } from '../../utils/mockData';
import { motion } from 'framer-motion';

export const WinnerSpotlight = () => {
  return (
    <section className="bg-charcoal py-24 relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gold/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-offwhite mb-4">Real winners. Real impact.</h2>
          <p className="text-white/60 max-w-2xl mx-auto font-sans">
            Every month, our members take home life-changing prizes. Here are some of our latest winners.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {mockWinners.map((winner, idx) => (
            <motion.div
              key={winner.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
            >
              <DrawResultCard 
                winnerName={winner.name}
                matchType={winner.matchType}
                prizeAmount={winner.prize}
                charityName={winner.charity}
                date={winner.draw}
              />
            </motion.div>
          ))}
        </div>
        
        <p className="text-center text-[10px] text-white/30 uppercase tracking-widest font-sans">
          Winner verification is required before payout
        </p>
      </div>
    </section>
  );
};
