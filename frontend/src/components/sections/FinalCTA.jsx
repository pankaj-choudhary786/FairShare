import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { Check } from 'lucide-react';

export const FinalCTA = () => {
  const features = [
    "Enter up to 5 Stableford scores",
    "Entry into all monthly draws",
    "Minimum 10% charity donation",
    "Member dashboard & stats",
    "Cancel anytime"
  ];

  return (
    <section className="bg-offwhite text-charcoal py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-6">Ready to play for something bigger?</h2>
          <p className="text-charcoal/60 max-w-2xl mx-auto text-lg font-sans">
            Join the community today. Support a great cause and give yourself the chance to win every single month.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Monthly Plan */}
          <Card variant="light" className="p-8 border border-charcoal/5 flex flex-col hover:border-gold/30 transition-colors">
            <h3 className="text-2xl font-playfair font-medium mb-2">Monthly</h3>
            <div className="flex items-end gap-1 mb-8">
              <span className="text-4xl font-mono text-charcoal">£9.99</span>
              <span className="text-sm text-charcoal/50 mb-1">/ month</span>
            </div>
            
            <ul className="space-y-4 mb-8 flex-grow">
              {features.map((feature, i) => (
                <li key={i} className="flex items-start">
                  <Check className="w-5 h-5 text-gold mr-3 shrink-0 mt-0.5" />
                  <span className="text-sm text-charcoal/80 font-sans">{feature}</span>
                </li>
              ))}
            </ul>
            
            <Link to="/signup" state={{ plan: 'monthly' }} className="w-full">
              <Button variant="secondary" className="w-full border-charcoal/20 text-charcoal hover:bg-charcoal/5 bg-transparent">
                Start Monthly
              </Button>
            </Link>
          </Card>

          {/* Yearly Plan */}
          <Card variant="dark" className="p-8 border-none bg-[#111] text-offwhite relative flex flex-col shadow-2xl transform md:-translate-y-4">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold to-[#D4B55E]"></div>
            <div className="absolute top-4 right-4 animate-subtle-pulse">
              <Badge variant="gold">Save 16%</Badge>
            </div>
            
            <h3 className="text-2xl font-playfair font-medium mb-2 text-gold">Yearly</h3>
            <div className="flex items-end gap-1 mb-8">
              <span className="text-4xl font-mono">£99.99</span>
              <span className="text-sm text-white/50 mb-1">/ year</span>
            </div>
            
            <ul className="space-y-4 mb-8 flex-grow">
              {features.map((feature, i) => (
                <li key={i} className="flex items-start">
                  <Check className="w-5 h-5 text-gold mr-3 shrink-0 mt-0.5" />
                  <span className="text-sm text-white/80 font-sans">{feature}</span>
                </li>
              ))}
            </ul>
            
            <Link to="/signup" state={{ plan: 'yearly' }} className="w-full">
              <Button variant="primary" className="w-full shadow-[0_0_20px_rgba(201,168,76,0.2)]">
                Start Yearly
              </Button>
            </Link>
          </Card>
        </div>

        <div className="mt-12 text-center text-xs text-charcoal/40 font-medium tracking-wide uppercase flex flex-wrap justify-center gap-x-8 gap-y-4 font-sans">
          <span>Secure payments via Stripe</span>
          <span>Cancel anytime</span>
          <span>PCI Compliant</span>
        </div>
      </div>
    </section>
  );
};
