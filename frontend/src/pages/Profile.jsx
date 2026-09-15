import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Plus, X, Github, Linkedin, Twitter, Globe, Pencil } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import * as userService from '../services/userService';
import Card from '../components/Card';
import Badge from '../components/Badge';

const Profile = () => {
  const { user, updateUserInContext } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, control, reset } = useForm({
    defaultValues: {
      name: user?.name || '',
      bio: user?.bio || '',
      skills: user?.skills?.map((s) => ({ value: s })) || [],
      socialLinks: user?.socialLinks || { github: '', linkedin: '', twitter: '', portfolio: '' },
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'skills' });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        name: data.name,
        bio: data.bio,
        skills: data.skills.map((s) => s.value).filter(Boolean),
        socialLinks: data.socialLinks,
      };
      const res = await userService.updateProfile(payload);
      updateUserInContext(res.user);
      toast.success('Profile updated successfully');
      setEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    setEditing(false);
  };

  return (
    <div className="animate-fade-in space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl text-gray-900 dark:text-white">Profile & Portfolio</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage your developer profile, skills list, and social link showcases.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column: Summary Card */}
        <Card className="p-6 border border-purple-100 dark:border-royal-darkBorder bg-white dark:bg-royal-darkCard text-center flex flex-col items-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary-600 to-indigo-600 text-3xl font-bold text-white shadow-md shadow-primary-500/20 mb-4">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">{user?.name}</h2>
          <p className="text-xs text-gray-400 mt-1">{user?.email}</p>
          <div className="mt-3">
            <Badge text={user?.role} variant={user?.role} />
          </div>
          
          <div className="mt-6 border-t border-purple-50 dark:border-royal-darkBorder pt-6 w-full text-left space-y-4">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Bio Summary</p>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
                {user?.bio || 'No bio description added yet.'}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4 text-xs pt-2">
              {user?.socialLinks?.github && (
                <a href={user.socialLinks.github} target="_blank" rel="noreferrer" className="flex items-center gap-1 font-bold text-primary-600 dark:text-primary-400 hover:underline">
                  <Github className="h-4 w-4" /> GitHub
                </a>
              )}
              {user?.socialLinks?.linkedin && (
                <a href={user.socialLinks.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1 font-bold text-primary-600 dark:text-primary-400 hover:underline">
                  <Linkedin className="h-4 w-4" /> LinkedIn
                </a>
              )}
              {user?.socialLinks?.twitter && (
                <a href={user.socialLinks.twitter} target="_blank" rel="noreferrer" className="flex items-center gap-1 font-bold text-primary-600 dark:text-primary-400 hover:underline">
                  <Twitter className="h-4 w-4" /> Twitter
                </a>
              )}
              {user?.socialLinks?.portfolio && (
                <a href={user.socialLinks.portfolio} target="_blank" rel="noreferrer" className="flex items-center gap-1 font-bold text-primary-600 dark:text-primary-400 hover:underline">
                  <Globe className="h-4 w-4" /> Portfolio
                </a>
              )}
              {!user?.socialLinks?.github && !user?.socialLinks?.linkedin && !user?.socialLinks?.twitter && !user?.socialLinks?.portfolio && (
                <p className="text-[10px] text-gray-400">No social portfolios attached.</p>
              )}
            </div>
            </div>
        </Card>

        {/* Right column: Content Details / Forms */}
        <Card className="lg:col-span-2 p-6 border border-purple-100 dark:border-royal-darkBorder bg-white dark:bg-royal-darkCard">
          <div className="mb-6 flex items-center justify-between border-b border-purple-50 dark:border-royal-darkBorder pb-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              {editing ? 'Edit Profile Details' : 'Portfolio Showcase'}
            </h3>
            {!editing && (
              <button onClick={() => setEditing(true)} className="btn-secondary py-1.5 px-4 text-xs font-bold">
                <Pencil className="h-3.5 w-3.5" /> Edit Profile
              </button>
            )}
          </div>

          {!editing ? (
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Extended Bio</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed bg-gray-50/50 dark:bg-royal-darkBg/20 border border-purple-50 dark:border-royal-darkBorder/40 p-4 rounded-xl">
                  {user?.bio || 'Introduce yourself by editing your profile. Write about your stack, experience level, and learning interests.'}
                </p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Core Competencies</h4>
                <div className="flex flex-wrap gap-2">
                  {user?.skills?.length ? (
                    user.skills.map((s) => (
                      <span key={s} className="rounded-xl bg-purple-50 px-3.5 py-1.5 text-xs font-bold text-primary-600 dark:bg-primary-950/40 dark:text-primary-300 border border-purple-100/40 dark:border-royal-darkBorder/40">
                        {s}
                      </span>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400">No skills added to portfolio.</p>
                  )}
                </div>
            </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="label-text">Display Name</label>
                <input className="input-field" placeholder="Your full name" {...register('name', { required: true })} />
              </div>
              
              <div>
                <label className="label-text">Bio description</label>
                <textarea rows={3} className="input-field" placeholder="Tell us about yourself..." {...register('bio')} />
              </div>

              <div>
                <label className="label-text">Skills & Technologies</label>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-2">
                      <input className="input-field" placeholder="e.g. React.js" {...register(`skills.${index}.value`)} />
                      <button type="button" onClick={() => remove(index)} className="rounded-xl border border-purple-50 p-2 text-red-500 hover:bg-red-50 dark:border-royal-darkBorder dark:hover:bg-red-950/20">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={() => append({ value: '' })} className="btn-secondary mt-2.5 py-1.5 px-3 text-xs">
                  <Plus className="h-3.5 w-3.5" /> Add Competency
                </button>
              </div>

              <div>
                <label className="label-text">Social Links</label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <input className="input-field" placeholder="GitHub URL" {...register('socialLinks.github')} />
                  <input className="input-field" placeholder="LinkedIn URL" {...register('socialLinks.linkedin')} />
                  <input className="input-field" placeholder="Twitter URL" {...register('socialLinks.twitter')} />
                  <input className="input-field" placeholder="Portfolio Website" {...register('socialLinks.portfolio')} />
                </div>
              </div>

              <div className="flex gap-3 pt-3 border-t border-purple-50 dark:border-royal-darkBorder">
                <button type="submit" disabled={loading} className="btn-primary py-2.5 px-6">
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" onClick={handleCancel} className="btn-secondary py-2.5 px-6">
                  Cancel
                </button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Profile;
