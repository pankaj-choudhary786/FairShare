import { createContext, useState, useEffect } from 'react';
import { supabase } from '../api/config/supabase';
import { authService } from '../api/services/auth.service';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (sessionUser) => {
    if (!sessionUser) {
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    try {
      let profileData = await authService.getProfile(sessionUser.id);
      const fullName =
        profileData?.full_name ||
        sessionUser?.user_metadata?.full_name ||
        sessionUser?.user_metadata?.fullName ||
        sessionUser?.email?.split('@')[0] ||
        'Member';

      try {
        await authService.ensureProfile({
          id: sessionUser.id,
          email: sessionUser.email,
          full_name: fullName,
        });
        profileData = await authService.getProfile(sessionUser.id);
      } catch (e) {
        console.error('Failed to ensure profile row', e);
      }

      setUser({ ...sessionUser, ...profileData });
      setIsAuthenticated(true);
      setIsAdmin(profileData?.is_admin || false);
    } catch (err) {
      console.error("Failed to load profile", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      const { session, error } = await authService.getSession();
      if (cancelled) return;

      if (error) {
        console.warn('Supabase session invalid; clearing local auth state.', error.message);
        await supabase.auth.signOut({ scope: 'local' });
        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      await fetchProfile(session?.user);
    };

    bootstrap();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      fetchProfile(session?.user);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      await authService.signIn(email, password);
      // onAuthStateChange handles the state updates
      return { success: true };
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.signOut();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isAdmin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
