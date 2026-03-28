import { createContext, useState, useContext, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { authService } from '../api/services/auth.service';

export const SubscriptionContext = createContext();

export const SubscriptionProvider = ({ children }) => {
  const { user, isAuthenticated } = useContext(AuthContext);
  
  const [plan, setPlan] = useState('none');
  const [status, setStatus] = useState('inactive');
  const [charityId, setCharityId] = useState(null);
  const [charityPercent, setCharityPercent] = useState(10);
  const [renewalDate, setRenewalDate] = useState(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      setPlan(user.plan || 'none');
      setStatus(user.status || 'inactive');
      setCharityId(user.charity_id || null);
      setCharityPercent(user.charity_percentage || 10);
      setRenewalDate(user.subscription_current_period_end || null);
    } else {
      setPlan('none');
      setStatus('inactive');
      setCharityId(null);
      setCharityPercent(10);
      setRenewalDate(null);
    }
  }, [user, isAuthenticated]);

  const updateCharitySettings = async (id, percent) => {
    if (!user) return;

    try {
      await authService.updateProfileFields(user.id, {
        charity_id: id,
        charity_percentage: percent,
      });

      setCharityId(id);
      setCharityPercent(percent);
    } catch (err) {
      console.error('Failed to update charity settings', err);
      throw err;
    }
  };

  const cancelSubscription = async () => {
    if (!user) return;

    try {
      /* subscription_status enum is active | inactive | lapsed — not 'cancelled' */
      await authService.updateProfileFields(user.id, { status: 'inactive' });
      setStatus('inactive');
    } catch (err) {
      console.error('Failed to cancel subscription', err);
      throw err;
    }
  };

  return (
    <SubscriptionContext.Provider value={{ 
      plan, 
      status, 
      charityId, 
      charityPercent,
      renewalDate,
      updateCharitySettings,
      cancelSubscription
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
};
