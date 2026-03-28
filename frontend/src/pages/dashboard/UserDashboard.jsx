import React, { useState, useContext } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { SubscriptionContext } from '../../context/SubscriptionContext';
import { 
  LayoutDashboard, 
  Target, 
  History, 
  HeartHandshake, 
  Trophy, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';

export const UserDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const { status } = useContext(SubscriptionContext);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const displayName = user?.full_name || user?.user_metadata?.full_name || user?.email || 'Member';

  const navItems = [
    { name: 'Overview', path: '/dashboard/overview', icon: LayoutDashboard },
    { name: 'My Scores', path: '/dashboard/scores', icon: Target },
    { name: 'Draw History', path: '/dashboard/draws', icon: History },
    { name: 'My Charity', path: '/dashboard/charity', icon: HeartHandshake },
    { name: 'Winnings', path: '/dashboard/winnings', icon: Trophy },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-white/10 hidden md:block">
        <h2 className="text-xl font-playfair font-bold text-offwhite tracking-wide">
          FAIR<span className="text-gold">SHARE</span>
        </h2>
      </div>
      
      <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-sans",
              isActive 
                ? "bg-gold/10 text-gold font-medium border border-gold/20 shadow-[0_0_15px_rgba(201,168,76,0.1)]" 
                : "text-white/60 hover:text-white hover:bg-white/5"
            )}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </div>
      
      <div className="p-6 border-t border-white/10 mt-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-charcoal border border-white/20 flex items-center justify-center shrink-0">
            <span className="text-gold font-playfair font-bold text-lg">{displayName.charAt(0).toUpperCase()}</span>
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-offwhite truncate">{displayName}</p>
            <p className="text-xs text-white/50 truncate font-sans">{user?.email}</p>
          </div>
        </div>
        <Button variant="secondary" className="w-full text-red-400 hover:text-red-300 hover:border-red-400/30 border-white/10 font-sans py-2" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-charcoal text-offwhite flex flex-col md:flex-row pb-16 md:pb-0">
      
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-white/10 bg-[#161616] sticky top-0 z-40">
        <h2 className="text-xl font-playfair font-bold text-offwhite tracking-wide">
          FAIR<span className="text-gold">SHARE</span>
        </h2>
        <button onClick={() => setMobileMenuOpen(true)} className="text-white/70 hover:text-white">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-[#161616] border-r border-white/10 h-screen sticky top-0 shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm md:hidden"
          >
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="w-4/5 max-w-[300px] h-full bg-[#161616] border-r border-white/10 flex flex-col absolute left-0 shadow-2xl"
            >
              <div className="absolute top-4 right-4">
                <button onClick={() => setMobileMenuOpen(false)} className="text-white/50 hover:text-white bg-white/5 rounded-full p-2">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-12 flex-1 flex flex-col">
                <SidebarContent />
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 lg:p-12 max-w-7xl mx-auto w-full">
        {status && status !== 'active' && (
          <div className="mb-6 rounded-xl border border-gold/30 bg-gold/5 px-4 py-3 text-sm font-sans text-white/90">
            Your membership is <strong className="text-gold">{status}</strong>. Complete Stripe checkout on{' '}
            <Link className="text-gold underline" to="/pricing">Pricing</Link> to activate draws and full access.
          </div>
        )}
        <AnimatePresence mode="wait">
          {/* We use an arbitrary key here, ideally useLocation key but keeping it simple */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Tab Nav */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#161616] border-t border-white/10 flex z-40 shadow-[0_-10px_20px_rgba(0,0,0,0.5)]">
        {navItems.slice(0, 5).map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => cn(
              "flex-1 flex flex-col items-center justify-center py-3 transition-colors",
              isActive ? "text-gold bg-white/5 pointer-events-none" : "text-white/40 hover:text-white/80 active:bg-white/5"
            )}
          >
            <item.icon className="w-5 h-5 mb-1" />
            <span className="text-[9px] uppercase font-sans tracking-wider truncate w-full text-center px-1">
              {item.name.replace('My ', '')}
            </span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};
