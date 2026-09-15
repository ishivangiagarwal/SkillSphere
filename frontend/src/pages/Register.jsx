import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { GraduationCap, Eye, EyeOff, Sparkles, UserPlus, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const { confirmPassword, ...payload } = data;
      await registerUser(payload);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[90vh] bg-royal-lightBg dark:bg-royal-darkBg items-center justify-center p-4">
      <div className="flex w-full max-w-4xl overflow-hidden rounded-3xl bg-white dark:bg-royal-darkCard border border-purple-100 dark:border-royal-darkBorder shadow-xl shadow-purple-900/5 min-h-[600px]">
        
        {/* Left Side - Graphic Branding */}
        <div className="hidden w-1/2 bg-gradient-to-br from-primary-950 via-primary-900 to-indigo-950 p-12 text-white lg:flex flex-col justify-between relative overflow-hidden border-r border-white/5">
          <div className="absolute top-10 right-10 h-64 w-64 rounded-full bg-primary-600/20 blur-[80px]" />
          
          <Link to="/" className="flex items-center gap-2 text-2xl font-black tracking-tight text-white z-10">
            <GraduationCap className="h-8 w-8 text-primary-400 animate-pulse-subtle" />
            <span>SkillSphere</span>
          </Link>

          <div className="space-y-4 z-10">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-primary-300 border border-white/10">
              <Sparkles className="h-3.5 w-3.5" /> Start Your Journey
            </div>
            <h2 className="text-3xl font-black leading-tight">Create Account</h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              Join SkillSphere today to access structured learning paths, code generators, interactive task managers, and portfolio platforms.
            </p>
          </div>

          <p className="text-xs text-gray-500 z-10">&copy; {new Date().getFullYear()} SkillSphere. All rights reserved.</p>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 p-8 sm:p-10 flex flex-col justify-center bg-white dark:bg-royal-darkCard">
          <div className="mb-4 lg:hidden flex flex-col items-center text-center">
            <Link to="/" className="inline-flex items-center gap-2 text-2xl font-black text-primary-600">
              <GraduationCap className="h-8 w-8" />
              <span>SkillSphere</span>
            </Link>
          </div>

          <div className="mb-4">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">Create Account</h2>
            <p className="mt-1 text-sm text-gray-400">Join our interactive learning workspace.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div>
              <label className="label-text">Full Name</label>
              <input className="input-field" placeholder="John Doe" {...register('name', { required: 'Name is required' })} />
              {errors.name && <p className="error-text">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
                <label className="label-text">Joining as</label>
                <select className="input-field" {...register('role', { required: true })} defaultValue="student">
                  <option value="student">Student</option>
                  <option value="mentor">Mentor</option>
                </select>
              </div>
            </div>

            <div>
              <label className="label-text">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input-field pr-10"
                  placeholder="Min. 6 characters"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' },
                  })}
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

            <div>
              <label className="label-text">Confirm Password</label>
              <input
                type="password"
                className="input-field"
                placeholder="Re-enter your password"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) => value === password || 'Passwords do not match',
                })}
              />
              {errors.confirmPassword && <p className="error-text">{errors.confirmPassword.message}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2">
              <UserPlus className="h-4 w-4" /> {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-primary-600 dark:text-primary-400 hover:underline">
              Log in
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Register;

