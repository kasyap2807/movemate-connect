import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Truck, Package, User, Mail, Lock, Phone, ArrowRight, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const Auth: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  
  const [mode, setMode] = useState<'login' | 'signup'>(searchParams.get('mode') === 'signup' ? 'signup' : 'login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    role: (searchParams.get('role') === 'provider' ? 'packer' : 'user') as UserRole,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (mode === 'login') {
        await login(formData.email, formData.password);
        toast.success('Welcome back!');
      } else {
        await signup({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          phone: formData.phone,
          role: formData.role,
        });
        toast.success('Account created successfully!');
      }
      
      // Navigate based on role
      if (formData.role === 'admin') {
        navigate('/admin');
      } else if (['packer', 'mover', 'packer_mover'].includes(formData.role)) {
        navigate('/provider-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const roleOptions: { value: UserRole; label: string; icon: typeof User; description: string }[] = [
    { value: 'user', label: 'Customer', icon: User, description: 'Looking to hire services' },
    { value: 'packer', label: 'Packer', icon: Package, description: 'Offer packing services' },
    { value: 'mover', label: 'Mover', icon: Truck, description: 'Offer transport services' },
    { value: 'packer_mover', label: 'Both', icon: Package, description: 'Offer full services' },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
              <Truck className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl text-foreground">MoveMate</span>
          </Link>

          <h1 className="text-3xl font-bold text-foreground mb-2">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="text-muted-foreground mb-8">
            {mode === 'login' 
              ? 'Enter your credentials to access your account' 
              : 'Get started with MoveMate today'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'signup' && (
              <>
                {/* Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your full name"
                      className="w-full h-12 pl-11 pr-4 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Enter your phone number"
                      className="w-full h-12 pl-11 pr-4 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Role Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">I want to</label>
                  <div className="grid grid-cols-2 gap-3">
                    {roleOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, role: option.value })}
                        className={`p-3 rounded-xl border-2 text-left transition-all ${
                          formData.role === option.value
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <option.icon className={`w-5 h-5 mb-1 ${formData.role === option.value ? 'text-primary' : 'text-muted-foreground'}`} />
                        <p className={`font-medium text-sm ${formData.role === option.value ? 'text-primary' : 'text-foreground'}`}>
                          {option.label}
                        </p>
                        <p className="text-xs text-muted-foreground">{option.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter your email"
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter your password"
                  className="w-full h-12 pl-11 pr-12 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {mode === 'login' && (
              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
              <button
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="ml-1 text-primary font-medium hover:underline"
              >
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right Panel - Info */}
      <div className="hidden lg:flex flex-1 gradient-hero p-12 items-center justify-center">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-md text-primary-foreground"
        >
          <h2 className="text-4xl font-bold mb-6">
            {mode === 'login' 
              ? 'Your trusted moving partner' 
              : 'Join the MoveMate community'}
          </h2>
          <p className="text-lg opacity-90 mb-8">
            {mode === 'login'
              ? 'Access your dashboard to manage bookings, chat with providers, and track your moves.'
              : 'Connect with verified service providers or grow your moving business with us.'}
          </p>
          
          <div className="space-y-4">
            {[
              'Verified & trusted providers',
              'Secure payment system',
              'Real-time chat support',
              'Transparent pricing'
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="flex items-center gap-3"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>{feature}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
