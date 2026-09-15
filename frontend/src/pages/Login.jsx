import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { GraduationCap, Eye, EyeOff, Sparkles, LogIn, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data);
      toast.success('Welcome back!');
      navigate(location.state?.from || '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[90vh] bg-royal-lightBg dark:bg-royal-darkBg items-center justify-center p-4">
      <div className="flex w-full max-w-4xl overflow-hidden rounded-3xl bg-white dark:bg-royal-darkCard border border-purple-100 dark:border-royal-darkBorder shadow-xl shadow-purple-900/5 min-h-[550px]">
        
        {/* Left Side - Graphic Branding */}
        <div className="hidden w-1/2 bg-gradient-to-br from-primary-950 via-primary-900 to-indigo-950 p-12 text-white lg:flex flex-col justify-between relative overflow-hidden border-r border-white/5">
          <div className="absolute top-10 right-10 h-64 w-64 rounded-full bg-primary-600/20 blur-[80px]" />
          
          <Link to="/" className="flex items-center gap-2 text-2xl font-black tracking-tight text-white z-10">
            <GraduationCap className="h-8 w-8 text-primary-400 animate-pulse-subtle" />
            <span>SkillSphere</span>
          </Link>

          <div className="space-y-4 z-10">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-primary-300 border border-white/10">
              <Sparkles className="h-3.5 w-3.5" /> Empowering Learners
            </div>
            <h2 className="text-3xl font-black leading-tight">Welcome Back!</h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              Login to continue your learning journey, access AI-guided studies, manage projects, and sync with the community.
            </p>
          </div>

          <p className="text-xs text-gray-500 z-10">&copy; {new Date().getFullYear()} SkillSphere. All rights reserved.</p>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center bg-white dark:bg-royal-darkCard">
          <div className="mb-6 lg:hidden flex flex-col items-center text-center">
            <Link to="/" className="inline-flex items-center gap-2 text-2xl font-black text-primary-600">
              <GraduationCap className="h-8 w-8" />
              <span>SkillSphere</span>
            </Link>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">Login</h2>
            <p className="mt-1 text-sm text-gray-400">Welcome back! Please enter your details.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label-text">Email</label>
              <input
                type="email"
                className="input-field"
                placeholder="you@example.com"
                {...register('email', { required: 'Email is required' })}
              />
              {errors.email && <p className="error-text">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                <Link to="/forgot-password" className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input-field pr-10"
                  placeholder="••••••••"
                  {...register('password', { required: 'Password is required' })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-500 transition-colors"
                >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="error-text">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-4">
              <LogIn className="h-4 w-4" /> {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-primary-600 dark:text-primary-400 hover:underline">
              Sign up
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;

