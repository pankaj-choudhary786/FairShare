import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, Link, Navigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { StepIndicator } from '../components/ui/StepIndicator';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { CharitySlider } from '../components/ui/CharitySlider';
import { charityService } from '../api/services/charity.service';
import { authService } from '../api/services/auth.service';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

const personalSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const Signup = () => {
  const { login, isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialPlan = searchParams.get('plan') === 'yearly' ? 'yearly' : 'monthly';

  const [step, setStep] = useState(1);
  const [charities, setCharities] = useState([]);
  const [signupData, setSignupData] = useState({
    plan: initialPlan,
    charityId: null,
    charityPercent: 10
  });
  const [isLoading, setIsLoading] = useState(false);
  const [signupComplete, setSignupComplete] = useState(false);

  React.useEffect(() => {
    const fetchCharities = async () => {
      try {
        const data = await charityService.getAllCharities();
        setCharities(data);
        if (data && data.length > 0) {
          setSignupData(prev => ({...prev, charityId: data[0].id}));
        }
      } catch (err) {
        console.error("Error fetching charities:", err);
      }
    };
    fetchCharities();
  }, []);

  const { register, handleSubmit, formState: { errors }, trigger } = useForm({
    resolver: zodResolver(personalSchema),
    mode: "onTouched"
  });

  // Redirect logged-in users who wander here, unless they just finished signing up
  if (isAuthenticated && !signupComplete && !isLoading) {
    return <Navigate to={user?.is_admin ? "/admin" : "/dashboard"} />;
  }

  const nextStep = async () => {
    if (step === 1) {
      const isValid = await trigger();
      if (isValid) setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSignup = async (data) => {
    setIsLoading(true);
    try {
      const fullName = `${data.firstName} ${data.lastName}`;
      await authService.signUp(
        data.email, 
        data.password, 
        fullName, 
        signupData.charityId, 
        signupData.plan, 
        signupData.charityPercent
      );
      setIsLoading(false);
      setSignupComplete(true);
    } catch (error) {
      toast.error(error.message || "Registration failed. Please try again.");
      setIsLoading(false);
    }
  };

  if (signupComplete) {
    return (
      <div className="min-h-screen bg-charcoal flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="w-24 h-24 rounded-full bg-gold/20 flex items-center justify-center mb-8 mx-auto border-2 border-gold shadow-[0_0_30px_rgba(201,168,76,0.3)]"
        >
          <Check className="w-12 h-12 text-gold" />
        </motion.div>
        <h1 className="text-5xl font-playfair font-bold text-offwhite mb-4">You're in!</h1>
        <p className="text-xl text-white/70 mb-10 max-w-md font-sans">
          Welcome to Fairshare. Your account is created and ready for your first Stableford score.
        </p>
        <Link to="/dashboard">
          <Button variant="primary" size="lg">
            Go to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  const renderStepContent = () => {
    switch(step) {
      case 1:
        return (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h2 className="text-2xl font-playfair font-bold text-offwhite mb-2">Personal Details</h2>
            <p className="text-white/50 text-sm mb-6 font-sans">Enter your information to create an account.</p>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1 font-sans">First Name</label>
                  <input {...register("firstName")} className={`w-full bg-white/5 border ${errors.firstName ? 'border-red-500/50' : 'border-white/10'} rounded-md py-2.5 px-3 text-offwhite focus:outline-none focus:border-gold/50 transition-colors`} />
                  {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1 font-sans">Last Name</label>
                  <input {...register("lastName")} className={`w-full bg-white/5 border ${errors.lastName ? 'border-red-500/50' : 'border-white/10'} rounded-md py-2.5 px-3 text-offwhite focus:outline-none focus:border-gold/50 transition-colors`} />
                  {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName.message}</p>}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1 font-sans">Email Address</label>
                <input {...register("email")} type="email" className={`w-full bg-white/5 border ${errors.email ? 'border-red-500/50' : 'border-white/10'} rounded-md py-2.5 px-3 text-offwhite focus:outline-none focus:border-gold/50 transition-colors`} />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1 font-sans">Password</label>
                <input {...register("password")} type="password" className={`w-full bg-white/5 border ${errors.password ? 'border-red-500/50' : 'border-white/10'} rounded-md py-2.5 px-3 text-offwhite focus:outline-none focus:border-gold/50 transition-colors`} />
                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1 font-sans">Confirm Password</label>
                <input {...register("confirmPassword")} type="password" className={`w-full bg-white/5 border ${errors.confirmPassword ? 'border-red-500/50' : 'border-white/10'} rounded-md py-2.5 px-3 text-offwhite focus:outline-none focus:border-gold/50 transition-colors`} />
                {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>}
              </div>
            </div>
            
            <Button type="button" onClick={nextStep} className="w-full mt-8">Continue to Plan</Button>
          </motion.div>
        );
      case 2:
        return (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h2 className="text-2xl font-playfair font-bold text-offwhite mb-2">Choose Your Plan</h2>
            <p className="text-white/50 text-sm mb-6 font-sans">Select how you'd like to subscribe to Fairshare.</p>
            
            <div className="space-y-4">
              <Card 
                variant="dark" 
                className={`p-5 cursor-pointer border-2 transition-all ${signupData.plan === 'monthly' ? 'border-gold bg-gold/5' : 'border-white/10 hover:border-white/30'}`}
                onClick={() => setSignupData({...signupData, plan: 'monthly'})}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-playfair text-lg text-offwhite mb-1">Monthly Member</h4>
                    <p className="text-sm text-white/50 font-sans">Rolling monthly access</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-mono text-offwhite block">£9.99</span>
                    <span className="text-xs text-white/40 font-sans">/ mo</span>
                  </div>
                </div>
              </Card>

              <Card 
                variant="dark" 
                className={`p-5 cursor-pointer border-2 transition-all relative overflow-hidden ${signupData.plan === 'yearly' ? 'border-gold bg-gold/5' : 'border-white/10 hover:border-white/30'}`}
                onClick={() => setSignupData({...signupData, plan: 'yearly'})}
              >
                <div className="absolute top-0 right-0 bg-gold text-charcoal text-[10px] font-bold px-3 py-1 rounded-bl-lg font-sans">SAVE 16%</div>
                <div className="flex justify-between items-center mt-2">
                  <div>
                    <h4 className="font-playfair text-lg text-offwhite mb-1">Annual Member</h4>
                    <p className="text-sm text-white/50 font-sans">Billed yearly (£8.33/mo)</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-mono text-gold block">£99.99</span>
                    <span className="text-xs text-white/40 font-sans">/ yr</span>
                  </div>
                </div>
              </Card>
            </div>
            
            <div className="flex gap-4 mt-8">
              <Button type="button" variant="secondary" onClick={prevStep} className="w-1/3">Back</Button>
              <Button type="button" onClick={nextStep} className="w-2/3">Choose Charity</Button>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h2 className="text-2xl font-playfair font-bold text-offwhite mb-2">Choose Your Charity</h2>
            <p className="text-white/50 text-sm mb-6 font-sans">Select who you want to support and set your contribution percentage.</p>
            
            <div className="mb-6 max-h-[220px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
              {charities.map(c => (
                <div 
                  key={c.id}
                  onClick={() => setSignupData({...signupData, charityId: c.id})}
                  className={`p-3 rounded-xl border flex gap-4 items-center cursor-pointer transition-colors ${signupData.charityId === c.id ? 'border-sage bg-sage/10' : 'border-white/10 bg-white/5 hover:border-white/30'}`}
                >
                  <img src={c.image_url} alt={c.name} className="w-12 h-12 rounded-lg object-cover" />
                  <div>
                    <h5 className="font-playfair text-offwhite">{c.name}</h5>
                    <p className="text-xs text-white/50 font-sans">{c.category}</p>
                  </div>
                  {signupData.charityId === c.id && <Check className="w-5 h-5 text-sage ml-auto" />}
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-white/10">
              <label className="block text-sm font-medium text-white/70 mb-4 font-sans">Contribution Percentage</label>
              <CharitySlider 
                percentage={signupData.charityPercent}
                setPercentage={(val) => setSignupData({...signupData, charityPercent: val})}
                planPrice={signupData.plan === 'yearly' ? 99.99 : 9.99}
              />
            </div>
            
            <div className="flex gap-4 mt-8">
              <Button type="button" variant="secondary" onClick={prevStep} className="w-1/3" disabled={isLoading}>Back</Button>
              <Button type="button" onClick={handleSubmit(handleSignup)} className="w-2/3" isLoading={isLoading}>Complete Signup</Button>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-charcoal py-12 px-6 flex flex-col items-center">
      <Link to="/" className="text-2xl font-playfair font-bold text-offwhite mb-12">
        FAIR<span className="text-gold">SHARE</span>
      </Link>

      <div className="w-full max-w-lg">
        <StepIndicator currentStep={step} totalSteps={3} className="mb-12" />
        
        <Card variant="dark" className="p-8 shadow-2xl border-white/10 bg-black/40">
          <AnimatePresence mode="wait">
            {renderStepContent()}
          </AnimatePresence>
        </Card>
      </div>
    </div>
  );
};
