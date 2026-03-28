import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Link } from 'react-router-dom';

export const CharityImpact = () => {
  return (
    <section className="bg-charcoal py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Badge variant="sage" className="mb-6">Charity First</Badge>
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-offwhite leading-tight mb-6">
              10% of every subscription goes to a cause you choose
            </h2>
            <div className="space-y-4 text-white/70 font-sans mb-8">
              <p>
                We believe in giving back. When you join Fairshare, you select a charity to support. A guaranteed 10% of your subscription goes directly to them.
              </p>
              <p>
                Want to do more? You can voluntarily increase your contribution percentage at any time from your dashboard, or make independent donations without playing.
              </p>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8 hover:bg-white/10 transition-colors">
              <span className="text-3xl font-mono text-sage block mb-2">£12,090+</span>
              <span className="text-sm text-white/50 font-medium">Raised across 8 verified partner charities</span>
            </div>
            
            <Link to="/charities">
              <Button variant="secondary" className="border-sage text-sage hover:bg-sage/10 hover:border-sage">
                Explore Charities
              </Button>
            </Link>
          </motion.div>

          {/* Featured Charity Image/Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-sage/20 blur-3xl rounded-full z-0 pointer-events-none"></div>
            <div className="relative z-10 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <div className="aspect-[4/5] md:aspect-square relative">
                <img 
                  src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80" 
                  alt="Community Impact" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent"></div>
                
                <div className="absolute bottom-0 left-0 w-full p-8">
                  <Badge variant="sage" className="mb-3 bg-charcoal/80 backdrop-blur-md border-none">Currently Supported</Badge>
                  <h3 className="text-2xl font-playfair text-offwhite mb-2">Golf for Good</h3>
                  <p className="text-sm text-white/70 mb-4 line-clamp-2">Bringing the game to underprivileged youth across the UK, providing equipment, coaching, and mentorship.</p>
                  <div className="flex items-center text-sm font-medium text-sage">
                    <span className="w-2 h-2 rounded-full bg-sage mr-2 animate-pulse"></span>
                    412 Members Supporting
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
