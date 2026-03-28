import React from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Hero } from '../components/sections/Hero';
import { HowItWorksSteps } from '../components/sections/HowItWorksSteps';
import { DrawMechanics } from '../components/sections/DrawMechanics';
import { PrizeTicker } from '../components/sections/PrizeTicker';
import { CharityImpact } from '../components/sections/CharityImpact';
import { CharityCarousel } from '../components/sections/CharityCarousel';
import { WinnerSpotlight } from '../components/sections/WinnerSpotlight';
import { FinalCTA } from '../components/sections/FinalCTA';

export const Home = () => {
  return (
    <PageWrapper className="pt-0 pb-0">
      <Hero />
      <HowItWorksSteps />
      <DrawMechanics />
      <PrizeTicker />
      <CharityImpact />
      <CharityCarousel />
      <WinnerSpotlight />
      <FinalCTA />
    </PageWrapper>
  );
};
