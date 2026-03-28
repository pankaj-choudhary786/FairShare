import React, { useState, useContext } from 'react';
import { Outlet, NavLink, useNavigate, Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { 
  BarChart3, 
  Users, 
  Dices, 
  HeartHandshake, 
  ShieldCheck,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';

export const AdminDashboard = () => {
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Security check - redirect if not admin
  if (!isAuthenticated || !user?.isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  const navItems = [
    { name: 'Overview', path: '/admin/overview', icon: BarChart3 },
    { name: 'User Management', path: '/admin/users', icon: Users },
    { name: 'Draw Management', path: '/admin/draws', icon: Dices },
    { name: 'Verify Winners', path: '/admin/verifications', icon: ShieldCheck },
    { name: 'Charity Partners', path: '/admin/charities', icon: HeartHandshake },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-white/10 hidden md:block">
        <h2 className="text-xl font-playfair font-bold text-offwhite tracking-wide flex items-center gap-2">
          FAIR<span className="text-gold">SHARE</span>
          <span className="text-[10px] font-mono tracking-widest text-[#E34234] border border-[#E34234]/50 bg-[#E34234]/10 rounded px-1.5 py-0.5 ml-2">ADMIN</span>
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
                ? "bg-[#E34234]/10 text-[#E34234] font-medium border border-[#E34234]/20 shadow-[0_0_15px_rgba(227,66,52,0.1)]" 
                : "text-white/60 hover:text-white hover:bg-white/5"
            )}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </div>
      
      <div className="p-6 border-t border-white/10 mt-auto">
        <Button variant="secondary" className="w-full text-red-400 hover:text-red-300 hover:border-red-400/30 font-sans py-2" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out Admin
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-charcoal text-offwhite flex flex-col md:flex-row pb-16 md:pb-0">
      
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-offwhite/10 bg-[#161616] sticky top-0 z-40">
        <h2 className="text-xl font-playfair font-bold text-offwhite tracking-wide flex items-center">
          FAIR<span className="text-gold">SHARE</span>
          <span className="text-[9px] font-mono tracking-widest text-[#E34234] ml-2">ADMIN</span>
        </h2>
        <button onClick={() => setMobileMenuOpen(true)} className="text-white/70 hover:text-white">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-[#101010] border-r border-[#E34234]/20 h-screen sticky top-0 shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm md:hidden"
          >
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="w-4/5 max-w-[300px] h-full bg-[#101010] border-r border-[#E34234]/20 flex flex-col absolute left-0 shadow-2xl"
            >
              <div className="absolute top-4 right-4">
                <button onClick={() => setMobileMenuOpen(false)} className="text-white/50 hover:text-white bg-white/5 p-2 rounded-full">
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
        <div className="bg-[#E34234]/10 border border-[#E34234]/20 rounded-md p-2 mb-8 flex items-center justify-center text-[#E34234] text-xs font-mono uppercase tracking-widest animate-pulse max-w-sm">
          Admin Environment Active
        </div>
        <AnimatePresence mode="wait">
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
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#101010] border-t border-[#E34234]/20 flex z-40 shadow-[0_-10px_20px_rgba(0,0,0,0.5)]">
        {navItems.slice(0, 5).map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => cn(
              "flex-1 flex flex-col items-center justify-center py-3 px-1 transition-colors",
              isActive ? "text-[#E34234] bg-white/5" : "text-white/40 hover:text-white/80 active:bg-white/5"
            )}
          >
            <item.icon className="w-5 h-5 mb-1" />
            <span className="text-[9px] uppercase font-sans tracking-wider truncate w-full text-center">
              {item.name.replace('Management', '').replace('Partners', '').trim()}
            </span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};
