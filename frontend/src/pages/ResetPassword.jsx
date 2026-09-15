import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { GraduationCap } from 'lucide-react';
import * as authService from '../services/authService';

const ResetPassword = () => {
  const { resetToken } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const password = watch('password');

  const onSubmit = async ({ password }) => {
    setLoading(true);
    try {
      await authService.resetPassword(resetToken, password);
      toast.success('Password reset successful. Please log in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed. Token may be invalid or expired.');
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
          <h2 className="mt-4 text-2xl font-black text-gray-900 dark:text-white">Reset your password</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4 p-8 border border-purple-100 dark:border-royal-darkBorder shadow-xl shadow-purple-900/5 bg-white dark:bg-royal-darkCard">
          <div>
            <label className="label-text">New Password</label>
            <input
              type="password"
              className="input-field"
              placeholder="Min. 6 characters"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Must be at least 6 characters' },
              })}
            />
            {errors.password && <p className="error-text">{errors.password.message}</p>}
          </div>
          <div>
            <label className="label-text">Confirm New Password</label>
            <input
              type="password"
              className="input-field"
              placeholder="Re-enter your new password"
              {...register('confirmPassword', {
                validate: (value) => value === password || 'Passwords do not match',
              })}
            />
            {errors.confirmPassword && <p className="error-text">{errors.confirmPassword.message}</p>}
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 mt-2">
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
