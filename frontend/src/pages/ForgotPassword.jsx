import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { GraduationCap, KeyRound } from 'lucide-react';
import * as authService from '../services/authService';

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async ({ email }) => {
    setLoading(true);
    try {
      const res = await authService.forgotPassword(email);
      setResetToken(res.resetToken);
      toast.success('Reset token generated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[85vh] bg-royal-lightBg dark:bg-royal-darkBg items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="mb-6 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-2xl font-black text-primary-600 dark:text-primary-400">
            <GraduationCap className="h-8 w-8 text-primary-500" />
            <span>SkillSphere</span>
          </Link>
          <h2 className="mt-4 text-2xl font-black text-gray-900 dark:text-white">Forgot password?</h2>
          <p className="mt-1 text-sm text-gray-400">
            Enter your email and we'll generate a reset link for you.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4 p-8 border border-purple-100 dark:border-royal-darkBorder shadow-xl shadow-purple-900/5 bg-white dark:bg-royal-darkCard">
          <div>
            <label className="label-text">Email Address</label>
            <input
              type="email"
              className="input-field"
              placeholder="you@example.com"
              {...register('email', { required: 'Email is required' })}
            />
            {errors.email && <p className="error-text">{errors.email.message}</p>}
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 mt-2">
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        {resetToken && (
          <div className="card mt-4 flex items-start gap-3 p-5 text-sm border border-purple-200 dark:border-royal-darkBorder bg-primary-50/20 dark:bg-royal-darkCard">
            <KeyRound className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-600 dark:text-primary-400" />
            <div>
              <p className="text-gray-600 dark:text-gray-300 font-medium">
                Since this project has no email service configured, here is your reset link:
              </p>
              <Link
                to={`/reset-password/${resetToken}`}
                className="mt-2 block break-all font-bold text-primary-600 dark:text-primary-400 hover:underline"
              >
                /reset-password/{resetToken}
              </Link>
            </div>
          </div>
        )}

        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Remembered your password?{' '}
          <Link to="/login" className="font-bold text-primary-600 dark:text-primary-400 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
