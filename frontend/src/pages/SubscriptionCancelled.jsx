import React from 'react';
import { Link } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Button } from '../components/ui/Button';

export const SubscriptionCancelled = () => {
  return (
    <PageWrapper>
      <div className="container mx-auto px-6 max-w-lg py-24 text-center">
        <h1 className="text-4xl font-playfair font-bold text-offwhite mb-4">Checkout cancelled</h1>
        <p className="text-white/60 font-sans mb-10">
          No payment was taken. You can return to pricing whenever you&apos;re ready.
        </p>
        <Link to="/pricing">
          <Button variant="secondary" size="lg">Back to pricing</Button>
        </Link>
      </div>
    </PageWrapper>
  );
};
