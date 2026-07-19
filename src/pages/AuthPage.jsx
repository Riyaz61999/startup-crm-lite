import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Activity, ShieldCheck, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    mobileNumber: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect user to where they tried to go before logging in
  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isLogin) {
        const result = await login(formData.email, formData.password);
        if (result && result.success) {
          toast.success('Successfully logged in!');
          navigate(from, { replace: true });
        }
      } else {
        const result = await register(formData);
        if (result && result.success) {
          toast.success('Registration successful! Please log in.');
          setIsLogin(true); // Switch to login view after successful registration
        }
      }
    } catch (error) {
      toast.error(error.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Column: Form Section */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-24 xl:px-32 relative">
        <div className="w-full max-w-sm mx-auto">
          {/* Mobile Only Brand Header */}
          <div className="lg:hidden mb-10 text-center">
            <h1 className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
              <Activity className="w-8 h-8" />
              Startup CRM
            </h1>
            <p className="text-text-gray mt-2 text-sm">Empowering your sales pipeline</p>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-extrabold text-text-dark tracking-tight">
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="mt-2 text-sm text-text-gray">
              {isLogin ? 'Enter your details to access your dashboard.' : 'Sign up to start managing your leads today.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-text-dark mb-1.5">Full Name</label>
                  <input
                    type="text"
                    name="username"
                    required={!isLogin}
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm font-medium text-text-dark placeholder:text-text-gray/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-dark mb-1.5">Mobile Number</label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    required={!isLogin}
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm font-medium text-text-dark placeholder:text-text-gray/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-semibold text-text-dark mb-1.5">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-text-gray/70" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-card border border-border rounded-xl text-sm font-medium text-text-dark placeholder:text-text-gray/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  placeholder="you@company.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-semibold text-text-dark">Password</label>
                {isLogin && (
                  <a href="#" className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
                    Forgot password?
                  </a>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-text-gray/70" />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-card border border-border rounded-xl text-sm font-medium text-text-dark placeholder:text-text-gray/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-xl font-semibold text-sm shadow-sm hover:bg-primary/90 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-text-gray">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Graphic/Branding Section (Hidden on Mobile/Tablet) */}
      <div className="hidden lg:flex flex-1 bg-primary items-center justify-center p-12 relative overflow-hidden">
        {/* Abstract background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-white blur-3xl"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-white blur-3xl"></div>
        </div>
        
        <div className="max-w-lg z-10 text-white space-y-8">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-secondary font-bold text-sm backdrop-blur-sm border border-white/20">
            <Activity className="w-4 h-4" />
            Startup CRM 2.0
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight">
            Accelerate your sales <br/>
            <span className="text-secondary">close deals faster.</span>
          </h2>
          
          <p className="text-lg text-white/80 leading-relaxed max-w-md">
            The all-in-one platform built for modern startups to track leads, forecast revenue, and manage pipelines efficiently.
          </p>

          <div className="grid grid-cols-2 gap-6 pt-8 border-t border-white/20">
            <div>
              <div className="flex items-center gap-2 mb-2 font-bold">
                <ShieldCheck className="w-5 h-5 text-secondary" />
                Enterprise Security
              </div>
              <p className="text-sm text-white/70">Bank-grade encryption for your most valuable data.</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2 font-bold">
                <Zap className="w-5 h-5 text-secondary" />
                Lightning Fast
              </div>
              <p className="text-sm text-white/70">Optimized workflows designed to save you hours every week.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
