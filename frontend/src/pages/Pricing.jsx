import React, { useContext, useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Check, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { createCheckoutSession } from '../api/subscriptionApi';
import toast from 'react-hot-toast';

export const Pricing = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loadingKey, setLoadingKey] = useState(null);

  const startCheckout = async (priceKey) => {
    if (!isAuthenticated) {
      navigate(`/signup?plan=${priceKey}`);
      return;
    }
    setLoadingKey(priceKey);
    try {
      await createCheckoutSession(priceKey);
    } catch (e) {
      toast.error(e.message || 'Could not start Stripe checkout. Is the backend running with Stripe keys?');
    } finally {
      setLoadingKey(null);
    }
  };

  const commonFeatures = [
    "Log unlimited Stableford scores",
    "Rolling 5-score draw entry",
    "Guaranteed minimum 10% charity donation",
    "Access to member dashboard",
    "Real-time draw verification",
    "Cancel anytime"
  ];

  return (
    <PageWrapper>
      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <div className="text-center mb-20 animate-fade-up">
          <span className="text-gold font-mono tracking-widest text-sm uppercase block mb-4">Membership</span>
          <h1 className="text-5xl md:text-6xl font-playfair font-bold text-offwhite mb-6">Simple, transparent pricing.</h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto font-sans">
            It costs less than a bucket of range balls to join. Plus, a portion always goes to exactly where it's needed most.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          {/* Monthly */}
          <Card variant="dark" className="p-10 flex flex-col hover:border-gold/30 transition-colors">
            <h3 className="text-2xl font-playfair font-bold text-offwhite mb-2">Monthly Member</h3>
            <p className="text-white/50 text-sm mb-6 font-sans">Perfect for casual golfers who want to play month-by-month.</p>
            
            <div className="flex items-end gap-1 mb-8 pb-8 border-b border-white/10">
              <span className="text-5xl font-mono text-offwhite font-light">£9.99</span>
              <span className="text-white/40 mb-1">/ mo</span>
            </div>
            
            <ul className="space-y-4 mb-10 flex-grow">
              {commonFeatures.map((f, i) => (
                <li key={i} className="flex items-start">
                  <Check className="w-5 h-5 text-gold mr-3 shrink-0 mt-0.5" />
                  <span className="text-sm text-white/80 font-sans">{f}</span>
                </li>
              ))}
            </ul>
            
            <Button
              variant="secondary"
              size="lg"
              className="w-full"
              isLoading={loadingKey === 'monthly'}
              onClick={() => startCheckout('monthly')}
            >
              Subscribe Monthly
            </Button>
          </Card>

          {/* Yearly */}
          <Card variant="dark" className="p-10 flex flex-col relative border-gold/30 shadow-[0_0_30px_rgba(201,168,76,0.1)] transform md:-translate-y-4 bg-gradient-to-b from-[#161616] to-[#0D0D0D]">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold to-[#D4B55E]"></div>
            <div className="absolute top-5 right-5">
              <Badge variant="gold" className="font-bold">2 MONTHS FREE</Badge>
            </div>
            
            <h3 className="text-2xl font-playfair font-bold text-gold mb-2">Annual Member</h3>
            <p className="text-white/50 text-sm mb-6 font-sans">Best value for dedicated golfers committing to the season.</p>
            
            <div className="flex items-end gap-1 mb-2">
              <span className="text-5xl font-mono text-offwhite font-light">£99.99</span>
              <span className="text-white/40 mb-1">/ yr</span>
            </div>
            <p className="text-xs text-gold/80 mb-8 pb-6 border-b border-white/10 font-sans tracking-wide">
              Works out at just £8.33 / month
            </p>
            
            <ul className="space-y-4 mb-10 flex-grow">
              {commonFeatures.map((f, i) => (
                <li key={i} className="flex items-start">
                  <Check className="w-5 h-5 text-gold mr-3 shrink-0 mt-0.5" />
                  <span className="text-sm text-white/80 font-sans">{f}</span>
                </li>
              ))}
              <li className="flex items-start">
                <Check className="w-5 h-5 text-gold mr-3 shrink-0 mt-0.5" />
                <span className="text-sm font-medium text-gold font-sans">Save 16% annually</span>
              </li>
            </ul>
            
            <Button
              variant="primary"
              size="lg"
              className="w-full shadow-[0_0_20px_rgba(201,168,76,0.2)]"
              isLoading={loadingKey === 'yearly'}
              onClick={() => startCheckout('yearly')}
            >
              Subscribe Annually
            </Button>
          </Card>
        </div>

        {/* Info Grid */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-16">
          <div className="flex items-center gap-3 mb-6">
            <HelpCircle className="text-gold w-6 h-6" />
            <h3 className="text-xl font-playfair font-bold text-offwhite">Where does your money go?</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <span className="text-3xl font-mono text-offwhite block mb-2">40%</span>
              <p className="text-sm text-white/60 font-sans">Directly funds the monthly <strong>Prize Pool</strong>. As our community grows, so do your potential winnings.</p>
            </div>
            <div>
              <span className="text-3xl font-mono text-sage block mb-2">10%+</span>
              <p className="text-sm text-white/60 font-sans">Given straight to your <strong>Chosen Charity</strong>. You can choose to increase this up to 50% at any time.</p>
            </div>
            <div>
              <span className="text-3xl font-mono text-gold block mb-2">50%</span>
              <p className="text-sm text-white/60 font-sans">Covers platform operations, transaction fees, marketing, and ensuring secure verified draws.</p>
            </div>
          </div>
        </div>

      </div>
    </PageWrapper>
  );
};
