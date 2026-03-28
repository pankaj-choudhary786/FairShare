import React, { useState, useContext, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { CharitySlider } from '../../components/ui/CharitySlider';
import { Modal } from '../../components/ui/Modal';
import { SubscriptionContext } from '../../context/SubscriptionContext';
import { charityService } from '../../api/services/charity.service';
import { createDonationCheckoutSession } from '../../api/subscriptionApi';
import { HeartHandshake, Search, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { SmartCharityImage } from '../../components/ui/SmartCharityImage';

const PRESET_AMOUNTS = [5, 10, 25, 50];

export const MyCharity = () => {
  const { charityId, charityPercent, updateCharitySettings, plan } = useContext(SubscriptionContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const donationToastDone = useRef(false);
  const [localPercent, setLocalPercent] = useState(charityPercent);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [donationModalOpen, setDonationModalOpen] = useState(false);
  const [donationPreset, setDonationPreset] = useState(10);
  const [donationCustom, setDonationCustom] = useState('');
  const [donationSubmitting, setDonationSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [charities, setCharities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    // Sync local state when context changes (e.g. initial load)
    if (charityPercent) setLocalPercent(charityPercent);
  }, [charityPercent]);

  React.useEffect(() => {
    const fetchCharities = async () => {
      try {
        const data = await charityService.getAllCharities();
        setCharities(data || []);
      } catch (err) {
        console.error("Failed to fetch charities", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCharities();
  }, []);

  useEffect(() => {
    const d = searchParams.get('donation');
    if (!d || donationToastDone.current) return;
    donationToastDone.current = true;
    if (d === 'success') toast.success('Thank you — your donation was completed.');
    if (d === 'cancelled') toast('Donation checkout was cancelled.', { duration: 4000 });
    const next = new URLSearchParams(searchParams);
    next.delete('donation');
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);
  
  const currentCharity = charities.find(c => c.id === charityId) || charities[0] || null;
  const planPrice = plan === 'yearly' ? 99.99 : 9.99;

  const handleSavePercent = () => {
    updateCharitySettings(charityId, localPercent);
    toast.success("Contribution percentage updated");
  };

  const handleSelectCharity = (id) => {
    updateCharitySettings(id, charityPercent);
    setIsModalOpen(false);
    toast.success("Supported charity updated");
  };

  const filteredCharities = charities.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) && c.id !== charityId
  );

  const resolveDonationAmountGbp = () => {
    if (donationCustom.trim() !== '') {
      const n = parseFloat(donationCustom.replace(/[^0-9.]/g, ''));
      return Number.isFinite(n) ? n : NaN;
    }
    return donationPreset;
  };

  const openCharityDonationPage = () => {
    const url = currentCharity?.donation_url?.trim();
    if (!url) return;
    try {
      const u = new URL(url.startsWith('http') ? url : `https://${url}`);
      window.open(u.href, '_blank', 'noopener,noreferrer');
    } catch {
      toast.error('Invalid donation link. Ask an admin to update this charity.');
    }
  };

  const handleStripeDonation = async () => {
    const amt = resolveDonationAmountGbp();
    if (!Number.isFinite(amt) || amt < 1 || amt > 5000) {
      toast.error('Enter an amount between £1 and £5,000.');
      return;
    }
    setDonationSubmitting(true);
    try {
      await createDonationCheckoutSession({
        amountGbp: amt,
        charityId: currentCharity.id,
        charityName: currentCharity.name,
      });
    } catch (e) {
      toast.error(e.message || 'Could not start donation checkout.');
    } finally {
      setDonationSubmitting(false);
    }
  };

  if (isLoading || !currentCharity) {
    return <div className="text-center py-20 text-white/50">Loading charity details...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-3xl font-playfair font-bold text-offwhite mb-2">My Charity</h1>
        <p className="text-white/60 font-sans">Manage the cause you support and your contribution level.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Current Charity Card */}
        <Card variant="dark" className="overflow-hidden flex flex-col h-full border-sage/30 shadow-[0_0_30px_rgba(107,143,113,0.1)]">
          <div className="h-48 relative">
            <SmartCharityImage
              charity={currentCharity}
              alt={currentCharity.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal to-transparent"></div>
            <div className="absolute top-4 left-4">
              <Badge variant="sage" className="bg-charcoal/80 border-none backdrop-blur-md">Currently Supporting</Badge>
            </div>
          </div>
          <div className="p-6 flex flex-col flex-grow">
            <h3 className="text-2xl font-playfair font-bold text-offwhite mb-3">{currentCharity.name}</h3>
            <p className="text-white/60 text-sm font-sans mb-6 flex-grow">{currentCharity.description}</p>
            <div className="pt-6 border-t border-white/10 mt-auto flex justify-between items-center">
              <Button variant="secondary" onClick={() => setIsModalOpen(true)} className="w-full text-sage border-sage/30 hover:bg-sage/10 font-sans">Switch Charity</Button>
            </div>
          </div>
        </Card>

        {/* Contribution Settings */}
        <Card variant="dark" className="p-6 md:p-8 flex flex-col h-full bg-[#161616]">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
              <HeartHandshake className="w-6 h-6 text-gold" />
            </div>
            <h3 className="text-2xl font-playfair font-bold text-offwhite">My Contribution</h3>
          </div>

          <div className="mb-8 flex-grow">
            <p className="text-sm text-white/50 font-sans mb-6">
              You are currently donating <strong className="text-offwhite">{charityPercent}%</strong> of your subscription fee. You can increase this voluntarily.
            </p>
            
            <div className="p-6 pb-2 rounded-xl bg-charcoal border border-white/5 mb-8">
              <CharitySlider 
                percentage={localPercent} 
                setPercentage={setLocalPercent} 
                planPrice={planPrice} 
              />
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-white/10 flex justify-end">
            <Button 
              variant="primary" 
              onClick={handleSavePercent}
              disabled={localPercent === charityPercent}
            >
              Save Changes
            </Button>
          </div>
        </Card>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Change Charity">
        <div className="space-y-4">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input 
              type="text" 
              placeholder="Search charities..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-md py-3 pl-10 pr-4 text-sm text-offwhite focus:outline-none focus:border-sage/50 focus:ring-1 focus:ring-sage/50 font-sans"
            />
          </div>
          
          <div className="max-h-[350px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {filteredCharities.map(c => (
              <div 
                key={c.id}
                onClick={() => handleSelectCharity(c.id)}
                className="p-3 rounded-xl border border-white/10 bg-white/5 flex gap-4 items-center cursor-pointer hover:border-sage/50 hover:bg-sage/5 transition-colors group"
              >
                <SmartCharityImage charity={c} alt={c.name} className="w-14 h-14 rounded-lg object-cover" />
                <div>
                  <h5 className="font-playfair font-medium text-offwhite text-lg group-hover:text-sage transition-colors">{c.name}</h5>
                  <p className="text-xs text-white/50 font-sans">{c.category}</p>
                </div>
                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-xs font-sans font-medium text-sage border border-sage/50 bg-sage/10 px-3 py-1 rounded shadow-sm">Select</div>
              </div>
            ))}
            {filteredCharities.length === 0 && (
              <p className="text-center text-white/40 text-sm py-8 font-sans">No charities found matching "{searchTerm}".</p>
            )}
          </div>
        </div>
      </Modal>

      <div className="bg-sage/5 border border-sage/20 rounded-xl p-8 text-center mt-12 max-w-2xl mx-auto">
        <h4 className="font-playfair text-xl text-sage mb-3">Want to make an independent donation?</h4>
        <p className="text-sm text-white/60 font-sans mb-6 leading-relaxed">
          You can make a one-off donation directly to {currentCharity.name} without changing your subscription percentage.
        </p>
        <Button
          variant="secondary"
          type="button"
          className="border-sage/30 text-sage hover:bg-sage/10 hover:border-sage transition-colors px-8 font-sans"
          onClick={() => {
            setDonationCustom('');
            setDonationPreset(10);
            setDonationModalOpen(true);
          }}
        >
          Make a Donation
        </Button>
      </div>

      <Modal
        isOpen={donationModalOpen}
        onClose={() => !donationSubmitting && setDonationModalOpen(false)}
        title="Independent donation"
      >
        <p className="text-sm text-white/60 font-sans mb-4">
          Support <span className="text-offwhite font-medium">{currentCharity.name}</span> with a one-off payment. Card checkout is processed securely by Stripe.
        </p>

        {currentCharity.donation_url ? (
          <div className="mb-6 p-4 rounded-lg border border-sage/30 bg-sage/5">
            <p className="text-xs text-white/50 font-sans mb-2">Prefer to donate on the charity&apos;s own site?</p>
            <Button
              type="button"
              variant="secondary"
              className="w-full font-sans border-sage/40 text-sage"
              onClick={openCharityDonationPage}
            >
              <ExternalLink className="w-4 h-4 mr-2 inline" />
              Open charity donate page
            </Button>
          </div>
        ) : null}

        <p className="text-xs text-white/45 font-sans uppercase tracking-wider mb-2">Amount (GBP)</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {PRESET_AMOUNTS.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => {
                setDonationPreset(n);
                setDonationCustom('');
              }}
              className={`px-4 py-2 rounded-md text-sm font-sans border transition-colors ${
                donationCustom.trim() === '' && donationPreset === n
                  ? 'border-sage bg-sage/20 text-sage'
                  : 'border-white/15 text-white/70 hover:border-white/30'
              }`}
            >
              £{n}
            </button>
          ))}
        </div>
        <label className="block text-xs text-white/50 mb-1 font-sans">Or enter amount</label>
        <input
          type="text"
          inputMode="decimal"
          placeholder="e.g. 15"
          value={donationCustom}
          onChange={(e) => setDonationCustom(e.target.value)}
          className="w-full bg-charcoal border border-white/10 rounded-md py-2 px-3 text-offwhite text-sm mb-6 font-sans"
        />

        <div className="flex gap-3">
          <Button
            type="button"
            variant="secondary"
            className="flex-1 font-sans"
            disabled={donationSubmitting}
            onClick={() => setDonationModalOpen(false)}
          >
            Close
          </Button>
          <Button
            type="button"
            variant="primary"
            className="flex-1 font-sans"
            isLoading={donationSubmitting}
            onClick={handleStripeDonation}
          >
            Pay with card
          </Button>
        </div>
      </Modal>
    </div>
  );
};
