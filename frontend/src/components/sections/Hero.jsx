import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { StatCounter } from '../ui/StatCounter';
import { mockStats } from '../../utils/mockData';
import { ChevronDown } from 'lucide-react';

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center overflow-hidden">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=1920&q=80")' }}
      >
        <div className="absolute inset-0 bg-charcoal/85"></div>
        <div className="noise-overlay"></div>
      </div>

      <div className="container relative z-10 mx-auto px-6 text-center max-w-4xl flex flex-col items-center pt-20 md:pt-24 flex-grow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <Badge variant="gold" className="px-4 py-1.5 text-xs bg-charcoal/50 backdrop-blur-md">
            Monthly Draws &middot; Real Prizes &middot; Real Impact
          </Badge>
        </motion.div>

        <motion.h1 
          className="text-5xl md:text-7xl lg:text-[80px] font-playfair font-bold text-offwhite leading-tight mb-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Play Golf. Win Big. <br/>
          <span className="text-gold italic">Change Lives.</span>
        </motion.h1>

        <motion.p 
          className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl font-sans"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Enter your Stableford scores, join monthly prize draws, and contribute to a charity that matters to you.
        </motion.p>

        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Link to="/signup" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto text-lg hover:px-10 transition-all">Start Your Journey</Button>
          </Link>
          <Link to="/how-it-works" className="w-full sm:w-auto">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto text-lg backdrop-blur-sm">See How It Works</Button>
          </Link>
        </motion.div>
      </div>

      <motion.div 
        className="relative z-10 w-full mt-auto mb-10 px-6 hidden sm:block"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <div className="max-w-4xl mx-auto glass rounded-2xl p-6 lg:p-8 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center border-t border-white/20 relative shadow-[0_0_30px_rgba(201,168,76,0.05)]">
          <div className="absolute inset-0 bg-gold/5 blur-3xl rounded-full"></div>
          <div>
            <StatCounter end={mockStats.totalMembers} suffix="+" className="block text-3xl font-mono text-gold mb-1 relative z-10" />
            <span className="text-[10px] md:text-xs text-white/50 tracking-widest uppercase font-sans">Active Members</span>
          </div>
          <div>
            <StatCounter end={mockStats.prizePool} prefix="£" className="block text-3xl font-mono text-gold mb-1 relative z-10" />
            <span className="text-[10px] md:text-xs text-white/50 tracking-widest uppercase font-sans">Prize Pool</span>
          </div>
          <div>
            <StatCounter end={mockStats.charityDonated} prefix="£" className="block text-3xl font-mono text-gold mb-1 relative z-10" />
            <span className="text-[10px] md:text-xs text-white/50 tracking-widest uppercase font-sans">Donated to Charity</span>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 text-white/30 hidden sm:block"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown className="w-6 h-6" />
      </motion.div>
    </section>
  );
};
