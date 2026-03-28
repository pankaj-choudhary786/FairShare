import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import toast from 'react-hot-toast';

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const Login = () => {
  const { login, isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to={user?.is_admin ? "/admin" : "/dashboard"} />;
  }

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast.success("Welcome back!");
      // Navigation is handled automatically by the reactive `isAuthenticated` check above
    } catch (error) {
      toast.error(error.message || "Failed to login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex text-offwhite bg-charcoal">
      {/* Left side - image */}
      <div className="hidden lg:flex lg:w-1/2 relative border-r border-white/10">
        <div className="absolute inset-0 bg-charcoal/40 z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=1200&q=80" 
          alt="Golf Course" 
          className="w-full h-full object-cover grayscale opacity-50 block"
        />
        <div className="absolute bottom-20 left-12 right-12 z-20">
          <h2 className="text-4xl font-playfair font-bold mb-4">"It isn't just about the game anymore. It's about who you play for."</h2>
          <p className="text-gold uppercase tracking-widest text-sm font-sans">— Fairshare Community</p>
        </div>
      </div>

      {/* Right side - form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 md:px-16 xl:px-32 relative">
        <Link to="/" className="absolute top-8 left-6 md:left-16 text-2xl font-playfair font-bold text-offwhite tracking-wide">
          FAIR<span className="text-gold">SHARE</span>
        </Link>
        
        <div className="max-w-md w-full mx-auto">
          <div className="mb-10">
            <h1 className="text-4xl font-playfair font-bold mb-2">Welcome Back</h1>
            <p className="text-white/50 font-sans">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2 font-sans">Email Address</label>
              <input 
                {...register("email")}
                type="email" 
                className={`w-full bg-white/5 border ${errors.email ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/50' : 'border-white/10 focus:border-gold/50 focus:ring-gold/50'} rounded-md py-3 px-4 text-offwhite focus:outline-none focus:ring-1 transition-colors`}
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-white/70 font-sans">Password</label>
                <a href="#" className="text-sm text-gold hover:underline font-sans">Forgot password?</a>
              </div>
              <input 
                {...register("password")}
                type="password" 
                className={`w-full bg-white/5 border ${errors.password ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/50' : 'border-white/10 focus:border-gold/50 focus:ring-gold/50'} rounded-md py-3 px-4 text-offwhite focus:outline-none focus:ring-1 transition-colors`}
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>}
            </div>

            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="remember" 
                className="w-4 h-4 rounded border-white/20 bg-white/5 text-gold focus:ring-gold focus:ring-offset-charcoal cursor-pointer"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-white/60 cursor-pointer font-sans">Remember me for 30 days</label>
            </div>

            <Button type="submit" variant="primary" className="w-full py-3 text-lg mt-4" isLoading={isLoading}>
              Sign In
            </Button>
          </form>

          <p className="text-center mt-8 text-white/60 font-sans">
            Don't have an account? <Link to="/signup" className="text-gold font-medium hover:underline">Join now &rarr;</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
