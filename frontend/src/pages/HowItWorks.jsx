import React from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Card } from '../components/ui/Card';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowRight, Info, CheckCircle2, ShieldCheck, Gift } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export const HowItWorks = () => {
  const faqs = [
    { q: "What is Stableford format?", a: "Stableford is a scoring system used in golf that involves scoring points based on the number of strokes taken at each hole. The aim is to get the highest score possible, rather than the lowest number of strokes." },
    { q: "How are the numbers drawn?", a: "Every month, we use an algorithm-based draw engine or a verified random generator to select the winning 5-number combination. This combination is drawn from the range 1-45." },
    { q: "What happens if there is no 5-match winner?", a: "If no member matches all 5 numbers, the 40% jackpot prize pool automatically rolls over to the following month's draw, creating an even larger jackpot!" },
    { q: "How is my charity contribution calculated?", a: "A minimum of 10% of your subscription fee (£0.99 for monthly, £9.99 for yearly) goes directly to your selected charity. You can choose to increase this percentage at any time from your dashboard." }
  ];

  return (
    <PageWrapper>
      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        
        <div className="text-center mb-20 animate-fade-up">
          <h1 className="text-5xl md:text-6xl font-playfair font-bold text-offwhite mb-6">How the Platform Works</h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto font-sans">
            Fairshare gives you the chance to win big every month, just by playing golf and logging your scores, while supporting a cause you care about.
          </p>
        </div>

        {/* Path Flow */}
        <div className="mb-24 relative space-y-12 md:space-y-0">
          <div className="hidden md:flex absolute top-[120px] bottom-[120px] left-8 w-0.5 bg-white/10 z-0"></div>
          
          {[
            { title: "Choose Your Plan", desc: "Select a monthly (£9.99) or yearly (£99.99) subscription. Payments are processed securely via Stripe.", icon: ShieldCheck },
            { title: "Select a Charity", desc: "Pick a charity from our verified partners. A guaranteed 10% of your fee goes directly to them.", icon: Gift },
            { title: "Play & Score", desc: "Play a round of golf and enter your Stableford score (1-45). Your 5 most recent scores are your 'lottery numbers'.", icon: CheckCircle2 },
            { title: "Monthly Draw", desc: "On the 1st of every month, a 5-number combination is drawn. If your scores match, you win!", icon: Info }
          ].map((step, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:pb-16 last:pb-0"
            >
              <div className="w-16 h-16 rounded-full bg-charcoal border-2 border-gold flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(201,168,76,0.2)]">
                <step.icon className="w-6 h-6 text-gold" />
              </div>
              <Card variant="dark" className="p-8 flex-grow shadow-lg">
                <span className="text-gold font-mono text-sm mb-2 block">STEP 0{idx +1}</span>
                <h3 className="text-2xl font-playfair mb-3">{step.title}</h3>
                <p className="text-white/60 font-sans">{step.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* The 5-Score Rule Visual */}
        <div className="mb-24">
          <h2 className="text-3xl font-playfair font-bold mb-8 text-center text-offwhite">The 5-Score Rolling Rule</h2>
          <Card variant="dark" className="p-8 md:p-12 text-center bg-gradient-to-br from-charcoal to-[#1A1A1A]">
            <p className="text-white/70 mb-8 max-w-xl mx-auto font-sans">
              To enter a draw, you must have 5 valid Stableford scores logged. When you log a 6th score, it automatically replaces your oldest score. You always play with your most recent form!
            </p>
            <div className="flex flex-col md:flex-row justify-center items-center gap-4">
              {[32, 28, 41, 19, 35].map((score, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded bg-white/5 border border-white/10 flex items-center justify-center text-2xl font-mono text-gold mb-2 transition-transform hover:-translate-y-1">
                    {score}
                  </div>
                  <span className="text-[10px] text-white/40 uppercase font-sans">Score {i+1}</span>
                </div>
              ))}
              <ArrowRight className="text-white/20 hidden md:block mx-2" />
              <div className="flex flex-col items-center opacity-50">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded border border-dashed border-red-500/50 flex items-center justify-center text-2xl font-mono text-red-400 mb-2">
                  22
                </div>
                <span className="text-[10px] text-red-400 uppercase font-sans">Oldest (Dropped)</span>
              </div>
            </div>
          </Card>
        </div>

        {/* FAQs */}
        <div className="mb-16">
          <h2 className="text-3xl font-playfair font-bold mb-8 text-center text-offwhite">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <Card key={i} variant="dark" className="p-6 transition-colors hover:border-gold/30">
                <h4 className="text-lg font-playfair font-medium text-gold mb-2">{faq.q}</h4>
                <p className="text-white/60 text-sm font-sans">{faq.a}</p>
              </Card>
            ))}
          </div>
        </div>

        <div className="text-center pt-8 border-t border-white/10">
          <Link to="/signup">
            <Button variant="primary" size="lg" className="px-12 text-lg">Join the Club</Button>
          </Link>
        </div>
        
      </div>
    </PageWrapper>
  );
};
