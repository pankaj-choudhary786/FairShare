import React from 'react';
import { Link } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Button } from '../components/ui/Button';
import { Check } from 'lucide-react';

export const SubscriptionSuccess = () => {
  return (
    <PageWrapper>
      <div className="container mx-auto px-6 max-w-lg py-24 text-center">
        <div className="w-20 h-20 rounded-full bg-sage/20 flex items-center justify-center mx-auto mb-8 border border-sage/40">
          <Check className="w-10 h-10 text-sage" />
        </div>
        <h1 className="text-4xl font-playfair font-bold text-offwhite mb-4">You&apos;re subscribed</h1>
        <p className="text-white/60 font-sans mb-10">
          Payment can take a few seconds to sync. If the dashboard still shows &quot;inactive&quot;, refresh the page.
        </p>
        <Link to="/dashboard">
          <Button variant="primary" size="lg">Go to dashboard</Button>
        </Link>
      </div>
    </PageWrapper>
  );
};
