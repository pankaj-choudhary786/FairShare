import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { AuthContext } from '../../context/AuthContext';
import { cn } from '../../utils/cn';

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'Charities', path: '/charities' },
    { name: 'Pricing', path: '/pricing' }
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <nav className={cn(
        "fixed top-0 w-full z-40 transition-all duration-300",
        scrolled ? "bg-charcoal/90 backdrop-blur-md border-b border-white/10 py-4" : "bg-transparent py-6"
      )}>
        <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between">
          <Link to="/" className="text-2xl font-playfair font-bold text-offwhite tracking-wide">
            FAIR<span className="text-gold">SHARE</span>
          </Link>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-gold relative",
                    isActive(link.path) ? "text-gold" : "text-white/70"
                  )}
                >
                  {link.name}
                  {isActive(link.path) && (
                    <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-gold rounded-full" />
                  )}
                </Link>
              ))}
            </div>
            
            <div className="flex items-center space-x-4 border-l border-white/20 pl-6">
              {isAuthenticated ? (
                <Link to={user?.isAdmin ? "/admin" : "/dashboard"}>
                  <Button variant="primary" size="sm">Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link to="/login" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
                    Login
                  </Link>
                  <Link to="/signup">
                    <Button variant="primary" size="sm">Join Now</Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-white focus:outline-none"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-charcoal flex flex-col pt-24 px-6"
          >
            <button 
              className="absolute top-6 right-6 text-white focus:outline-none"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="w-8 h-8" />
            </button>
            <div className="flex flex-col space-y-6 text-2xl font-playfair">
              {navLinks.map((link, i) => (
                <motion.div 
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link 
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "block transition-colors",
                      isActive(link.path) ? "text-gold" : "text-white hover:text-gold"
                    )}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="pt-8 mt-8 border-t border-white/10 flex flex-col space-y-4"
              >
                {isAuthenticated ? (
                  <Link to={user?.isAdmin ? "/admin" : "/dashboard"} onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="primary" className="w-full">Go to Dashboard</Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="secondary" className="w-full">Login</Button>
                    </Link>
                    <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="primary" className="w-full">Join Now</Button>
                    </Link>
                  </>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
