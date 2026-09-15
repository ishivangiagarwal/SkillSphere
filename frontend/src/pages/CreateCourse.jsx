import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as courseService from '../services/courseService';
import Card from '../components/Card';

const CATEGORIES = ['Web Development', 'Data Science', 'Mobile Development', 'DevOps', 'AI & ML', 'Programming Basics'];

const CreateCourse = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { level: 'Beginner', category: CATEGORIES[0], duration: 5 } });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = { ...data, tags: data.tags ? data.tags.split(',').map((t) => t.trim()) : [] };
      const res = await courseService.createCourse(payload);
      toast.success('Course created successfully!');
      navigate(`/courses/${res.course._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl text-gray-900 dark:text-white">Create a New Course</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Launch a brand new curriculum for your students.</p>
      </div>

      <Card className="p-6 border border-purple-100 dark:border-royal-darkBorder bg-white dark:bg-royal-darkCard">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="label-text">Course Title</label>
            <input className="input-field" placeholder="e.g. Complete React.js Bootcamp" {...register('title', { required: 'Title is required' })} />
            {errors.title && <p className="error-text">{errors.title.message}</p>}
          </div>
          
          <div>
            <label className="label-text">Description</label>
            <textarea rows={4} className="input-field" placeholder="What will students learn in this curriculum?" {...register('description', { required: 'Description is required' })} />
            {errors.description && <p className="error-text">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="label-text">Category</label>
              <select className="input-field" {...register('category', { required: true })}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label-text">Level</label>
              <select className="input-field" {...register('level', { required: true })}>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
            <div>
              <label className="label-text">Duration (hrs)</label>
              <input type="number" min="1" className="input-field" {...register('duration', { required: true, valueAsNumber: true })} />
            </div>
          </div>

          <div>
            <label className="label-text">Tags (comma separated)</label>
            <input className="input-field" placeholder="react, frontend, javascript" {...register('tags')} />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2">
            {loading ? 'Creating...' : 'Create Course'}
          </button>
        </form>
      </Card>
    </div>
  );
};

export default CreateCourse;
