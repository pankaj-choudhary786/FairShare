import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { motion } from 'framer-motion';

export const DrawMechanics = () => {
  const tiers = [
    { name: "5-Number Match", share: "40%", desc: "Jackpot", rollover: true, icon: "🥇" },
    { name: "4-Number Match", share: "35%", desc: "Split equally", rollover: false, icon: "🥈" },
    { name: "3-Number Match", share: "25%", desc: "Split equally", rollover: false, icon: "🥉" }
  ];

  return (
    <section className="bg-offwhite py-24 text-charcoal">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold">Three ways to win every month</h2>
          <p className="mt-4 text-charcoal/60 max-w-2xl mx-auto">
            A fixed portion of every subscription goes directly into the prize pool. The more players, the bigger the prize.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {tiers.map((tier, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
            >
              <Card variant="dark" className="p-8 h-full bg-[#1A1A1A] border-none text-offwhite shadow-xl relative overflow-hidden group">
                {tier.rollover && (
                  <div className="absolute top-4 right-4 animate-pulse">
                    <Badge variant="gold" className="bg-gold text-charcoal border-none font-bold">ROLLOVER</Badge>
                  </div>
                )}
                <div className="text-4xl mb-4">{tier.icon}</div>
                <h3 className="text-2xl font-playfair mb-2">{tier.name}</h3>
                <div className="flex items-end gap-2 mb-6">
                  <span className="text-4xl font-mono text-gold leading-none">{tier.share}</span>
                  <span className="text-sm text-white/50 mb-1">of pool</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mb-4">
                  <div 
                    className="h-full bg-gradient-to-r from-gold to-[#D4B55E] rounded-full transition-all duration-1000" 
                    style={{ width: tier.share }}
                  ></div>
                </div>
                <p className="text-sm text-white/40">{tier.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center">
          <button className="text-sm font-medium text-charcoal/60 hover:text-charcoal border-b border-charcoal/20 pb-1 transition-colors">
            How is the pool calculated?
          </button>
        </div>
      </div>
    </section>
  );
};
