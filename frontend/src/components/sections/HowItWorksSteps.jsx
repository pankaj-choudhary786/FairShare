import React from 'react';
import { Card } from '../ui/Card';
import { CheckCircle2, Trophy, HeartHandshake } from 'lucide-react';
import { motion } from 'framer-motion';

export const HowItWorksSteps = () => {
  const steps = [
    {
      icon: <CheckCircle2 className="w-8 h-8 text-gold" />,
      title: "Subscribe",
      desc: "Choose monthly or yearly. Secure payments via Stripe."
    },
    {
      icon: <Trophy className="w-8 h-8 text-gold" />,
      title: "Score",
      desc: "Enter your last 5 Stableford scores. Latest always on top."
    },
    {
      icon: <HeartHandshake className="w-8 h-8 text-gold" />,
      title: "Win & Give",
      desc: "Monthly draws, real prizes, and a guaranteed charity donation."
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section className="bg-charcoal py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <span className="text-gold font-mono tracking-[0.2em] text-sm uppercase block mb-4">The Process</span>
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-offwhite">Simple steps. Serious impact.</h2>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 relative pt-12"
        >
          {/* Connecting line desktop */}
          <div className="hidden md:block absolute top-[55%] left-[15%] w-[70%] h-[1px] border-t-2 border-dashed border-white/10 z-0"></div>

          {steps.map((step, idx) => (
            <motion.div key={idx} variants={item} className="relative z-10 h-full">
              <span className="absolute -top-16 lg:-top-20 -left-2 lg:-left-6 text-[120px] lg:text-[140px] font-playfair font-black text-white/5 z-0 pointer-events-none select-none leading-none">
                {idx + 1}
              </span>
              <Card variant="dark" className="h-full p-8 relative z-10 flex flex-col items-center text-center group hover:-translate-y-2 transition-transform duration-500 bg-black/40">
                <div className="w-16 h-16 rounded-full bg-gold/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-gold/10">
                  {step.icon}
                </div>
                <h3 className="text-xl font-playfair font-medium text-offwhite mb-3">{step.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed font-sans">{step.desc}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
