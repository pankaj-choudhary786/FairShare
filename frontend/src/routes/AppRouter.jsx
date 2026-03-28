import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

// Public Pages
import { Home } from '../pages/Home';
import { HowItWorks } from '../pages/HowItWorks';
import { Charities } from '../pages/Charities';
import { CharityDetail } from '../pages/CharityDetail';
import { Pricing } from '../pages/Pricing';

// Auth Pages
import { Login } from '../pages/Login';
import { Signup } from '../pages/Signup';
import { SubscriptionSuccess } from '../pages/SubscriptionSuccess';
import { SubscriptionCancelled } from '../pages/SubscriptionCancelled';

// User Dashboard
import { UserDashboard } from '../pages/dashboard/UserDashboard';
import { Overview } from '../pages/dashboard/Overview';
import { ScoreEntry } from '../pages/dashboard/ScoreEntry';
import { DrawHistory } from '../pages/dashboard/DrawHistory';
import { MyCharity } from '../pages/dashboard/MyCharity';
import { Winnings } from '../pages/dashboard/Winnings';
import { Settings } from '../pages/dashboard/Settings';

// Admin Dashboard
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { AdminOverview } from '../pages/admin/Overview';
import { AdminUsers } from '../pages/admin/Users';
import { AdminDraws } from '../pages/admin/Draws';
import { CharityAdmin } from '../pages/admin/CharityAdmin';
import { Verifications } from '../pages/admin/Verifications';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useContext(AuthContext);
  if (!isAuthenticated || !user?.isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
};

// Layout wrapper for public pages
const PublicLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen bg-charcoal">
    <Navbar />
    <main className="flex-grow">
      {children}
    </main>
    <Footer />
  </div>
);

export const AppRouter = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/how-it-works" element={<PublicLayout><HowItWorks /></PublicLayout>} />
      <Route path="/charities" element={<PublicLayout><Charities /></PublicLayout>} />
      <Route path="/charities/:id" element={<PublicLayout><CharityDetail /></PublicLayout>} />
      <Route path="/pricing" element={<PublicLayout><Pricing /></PublicLayout>} />
      
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/subscription/success" element={<PublicLayout><SubscriptionSuccess /></PublicLayout>} />
      <Route path="/subscription/cancelled" element={<PublicLayout><SubscriptionCancelled /></PublicLayout>} />

      {/* User Dashboard Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>}>
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<Overview />} />
        <Route path="scores" element={<ScoreEntry />} />
        <Route path="draws" element={<DrawHistory />} />
        <Route path="charity" element={<MyCharity />} />
        <Route path="winnings" element={<Winnings />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Admin Dashboard Routes */}
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>}>
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<AdminOverview />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="draws" element={<AdminDraws />} />
        <Route path="charities" element={<CharityAdmin />} />
        <Route path="verifications" element={<Verifications />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
