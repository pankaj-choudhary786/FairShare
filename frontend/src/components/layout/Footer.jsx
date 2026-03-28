import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-[#0A0A0A] border-t border-white/5 pt-16 pb-8">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="text-2xl font-playfair font-bold text-offwhite tracking-wide mb-4 inline-block">
              FAIR<span className="text-gold">SHARE</span>
            </Link>
            <p className="text-white/50 text-sm max-w-sm mb-6">
              Play Golf. Win Big. Change Lives. The first subscription platform combining performance tracking with real rewards and charitable giving.
            </p>
            <div className="flex space-x-4">
              <span className="text-xs text-white/30 uppercase tracking-widest border border-white/10 px-3 py-1 rounded-full">Fairshare Ltd.</span>
            </div>
          </div>
          
          <div>
            <h4 className="text-offwhite font-medium mb-4">Platform</h4>
            <ul className="space-y-3 text-sm text-white/50">
              <li><Link to="/how-it-works" className="hover:text-gold transition-colors">How It Works</Link></li>
              <li><Link to="/charities" className="hover:text-gold transition-colors">Charities</Link></li>
              <li><Link to="/pricing" className="hover:text-gold transition-colors">Pricing</Link></li>
              <li><Link to="/login" className="hover:text-gold transition-colors">Member Login</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-offwhite font-medium mb-4">Legal</h4>
            <ul className="space-y-3 text-sm text-white/50">
              <li><a href="#" className="hover:text-white transition-colors">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Game Rules</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-white/40">
          <p>&copy; {new Date().getFullYear()} Fairshare. All rights reserved.</p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span>Secure Payments via Stripe</span>
            <span className="w-1 h-1 bg-white/20 rounded-full"></span>
            <span>PCI Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
