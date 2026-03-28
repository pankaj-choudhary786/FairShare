import React, { useContext, useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { AuthContext } from '../../context/AuthContext';
import { SubscriptionContext } from '../../context/SubscriptionContext';
import { authService } from '../../api/services/auth.service';
import { createCustomerPortalSession } from '../../api/subscriptionApi';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export const Settings = () => {
  const { user } = useContext(AuthContext);
  const { plan, status, renewalDate } = useContext(SubscriptionContext);
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    receiveNews: true,
    receiveDrawAlerts: true
  });
  const [isSaving, setIsSaving] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setProfileData({
      name: user.full_name || user.user_metadata?.full_name || '',
      email: user.email || '',
      phone: user.phone || '',
      receiveNews: user.notify_news !== false,
      receiveDrawAlerts: user.notify_draw_alerts !== false,
    });
  }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!user?.id) return;
    setIsSaving(true);
    try {
      await authService.updateProfileFields(user.id, {
        full_name: profileData.name,
        phone: profileData.phone || null,
        notify_news: profileData.receiveNews,
        notify_draw_alerts: profileData.receiveDrawAlerts,
      });
      toast.success('Profile settings updated');
    } catch (err) {
      toast.error(err.message || 'Could not save');
    } finally {
      setIsSaving(false);
    }
  };

  const openBillingPortal = async () => {
    setPortalLoading(true);
    try {
      await createCustomerPortalSession();
    } catch (err) {
      toast.error(err.message || 'Open pricing and subscribe first');
    } finally {
      setPortalLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div className="mb-8 hidden md:block">
        <h1 className="text-3xl font-playfair font-bold text-offwhite mb-2">Account Settings</h1>
        <p className="text-white/60 font-sans">Manage your personal details, preferences, and subscription.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          
          <Card variant="dark" className="p-6 md:p-8">
            <h3 className="text-xl font-playfair font-bold text-offwhite mb-6 border-b border-white/10 pb-4">Personal Information</h3>
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2 font-sans">Full Name</label>
                  <input 
                    type="text" 
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-md py-2.5 px-4 text-offwhite focus:outline-none focus:border-gold/50 font-sans"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2 font-sans">Email Address</label>
                  <input 
                    type="email" 
                    value={profileData.email}
                    disabled
                    className="w-full bg-charcoal/50 border border-white/5 rounded-md py-2.5 px-4 text-white/40 cursor-not-allowed font-sans"
                  />
                  <p className="text-[10px] text-white/30 mt-1 font-sans">To change your email, please contact support.</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2 font-sans">Phone Number</label>
                <input 
                  type="tel" 
                  placeholder="+44 7000 000000"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  className="w-full max-w-md bg-white/5 border border-white/10 rounded-md py-2.5 px-4 text-offwhite focus:outline-none focus:border-gold/50 font-sans"
                />
              </div>

              <div className="pt-4 border-t border-white/10">
                <Button type="submit" variant="primary" isLoading={isSaving} disabled={isSaving}>Save Changes</Button>
              </div>
            </form>
          </Card>

          <Card variant="dark" className="p-6 md:p-8">
            <h3 className="text-xl font-playfair font-bold text-offwhite mb-6 border-b border-white/10 pb-4">Preferences</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-offwhite font-sans">Draw Alerts</h4>
                  <p className="text-sm text-white/50 font-sans">Receive email notifications when draws happen.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer ml-4">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={profileData.receiveDrawAlerts}
                    onChange={() => setProfileData({...profileData, receiveDrawAlerts: !profileData.receiveDrawAlerts})}
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-offwhite font-sans">Platform News</h4>
                  <p className="text-sm text-white/50 font-sans">Receive updates about new charities and impact.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer ml-4">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={profileData.receiveNews}
                    onChange={() => setProfileData({...profileData, receiveNews: !profileData.receiveNews})}
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold"></div>
                </label>
              </div>
            </div>
          </Card>
        </div>

        <div className="md:col-span-1 space-y-8">
          <Card variant="dark" className="p-6 bg-[#161616]">
            <h3 className="text-lg font-playfair font-bold text-offwhite mb-4">Subscription</h3>
            
            <div className="space-y-4 font-sans">
              <div>
                <span className="block text-xs text-white/50 uppercase tracking-widest mb-1">Status</span>
                <Badge variant={status === 'active' ? 'active' : 'inactive'}>{status}</Badge>
              </div>
              
              <div>
                <span className="block text-xs text-white/50 uppercase tracking-widest mb-1">Current Plan</span>
                <span className="text-offwhite capitalize font-medium">{plan} Member</span>
              </div>
              
              {renewalDate && (
                <div>
                  <span className="block text-xs text-white/50 uppercase tracking-widest mb-1">Next Billing Date</span>
                  <span className="text-offwhite">{new Date(renewalDate).toLocaleDateString('en-GB')}</span>
                </div>
              )}
            </div>

            <div className="mt-8 space-y-3">
              <Button
                type="button"
                variant="secondary"
                className="w-full text-white/70 font-sans border-white/10"
                isLoading={portalLoading}
                onClick={openBillingPortal}
              >
                Manage billing (Stripe)
              </Button>
              <Link to="/pricing" className="block">
                <Button variant="secondary" className="w-full border-gold/30 text-gold font-sans">Change plan</Button>
              </Link>
            </div>
          </Card>

          <Card variant="dark" className="p-6 border-red-500/20 bg-red-500/5">
            <h3 className="text-lg font-playfair font-bold text-red-400 mb-2">Danger Zone</h3>
            <p className="text-sm text-white/50 font-sans mb-4 leading-relaxed">Once you delete your account, there is no going back. Please be certain.</p>
            <Button variant="secondary" className="w-full border-red-500/50 text-red-400 hover:bg-red-500/20 font-sans">Delete Account</Button>
          </Card>
        </div>
      </div>
    </div>
  );
};
