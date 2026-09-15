import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Clock, BookOpen, Code2, Database, Smartphone, Boxes, BrainCircuit, Terminal, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import * as courseService from '../services/courseService';
import Loader from '../components/Loader';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';

const CATEGORIES = ['Web Development', 'Data Science', 'Mobile Development', 'DevOps', 'AI & ML', 'Programming Basics'];

// Deterministic, topic-accurate visual per category — no dependency on
// external photo services, so it's always relevant and always loads.
const CATEGORY_VISUALS = {
  'Web Development': { icon: Code2, gradient: 'from-indigo-500 to-blue-500' },
  'Data Science': { icon: Database, gradient: 'from-emerald-500 to-teal-500' },
  'Mobile Development': { icon: Smartphone, gradient: 'from-fuchsia-500 to-pink-500' },
  DevOps: { icon: Boxes, gradient: 'from-orange-500 to-amber-500' },
  'AI & ML': { icon: BrainCircuit, gradient: 'from-violet-500 to-purple-500' },
  'Programming Basics': { icon: Terminal, gradient: 'from-cyan-500 to-sky-500' },
};

const Courses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('');

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;
      if (level) params.level = level;
      const res = await courseService.getCourses(params);
      setCourses(res.courses);
    } catch (err) {
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  }, [search, category, level]);

  useEffect(() => {
    const timer = setTimeout(fetchCourses, 300);
    return () => clearTimeout(timer);
  }, [fetchCourses]);

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl text-gray-900 dark:text-white">Explore Courses</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Find the right course to level up your skills.</p>
        </div>
        {(user?.role === 'mentor' || user?.role === 'admin') && (
          <Link to="/courses/create" className="btn-primary shadow-lg shadow-primary-500/25">
            <Plus className="h-4 w-4" /> Create Course
          </Link>
        )}
      </div>

      {/* Modern Filter panel */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            className="input-field pl-10"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="input-field" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="input-field" value={level} onChange={(e) => setLevel(e.target.value)}>
          <option value="">All Levels</option>
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>
      </div>

      {loading ? (
        <Loader full />
      ) : courses.length === 0 ? (
        <EmptyState icon={BookOpen} title="No courses found" description="Try adjusting your filters or search terms." />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 pt-4">
          {courses.map((course) => {
            const visual = CATEGORY_VISUALS[course.category] || { icon: BookOpen, gradient: 'from-primary-600 to-indigo-600' };
            const VisualIcon = visual.icon;
            return (
              <Link
                key={course._id}
                to={`/courses/${course._id}`}
                className="group card overflow-hidden border border-purple-100 hover:border-primary-500/40 dark:border-royal-darkBorder flex flex-col justify-between"
              >
                <div>
                  {/* Category Gradient Visual banner */}
                  <div className={`flex h-36 items-center justify-center bg-gradient-to-br ${visual.gradient} text-white relative`}>
                    <VisualIcon className="h-10 w-10 opacity-90 animate-pulse-subtle" strokeWidth={1.5} />
                    <div className="absolute top-4 left-4">
                      <span className="rounded-lg bg-white/10 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-white border border-white/10">
                        {course.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge text={course.level} variant={course.level} />
                      <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {course.duration} hrs
                      </span>
                    </div>
                    
                    <h3 className="text-base font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-primary-500 transition-colors leading-tight">
                      {course.title}
                    </h3>
                    <p className="line-clamp-2 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                      {course.description}
                    </p>
                  </div>
                </div>

                {/* Footer details */}
                <div className="mx-5 mb-5 border-t border-purple-50 dark:border-royal-darkBorder pt-4 flex items-center justify-between text-xs font-semibold text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <div className="h-6 w-6 rounded-full bg-primary-600 flex items-center justify-center text-[10px] font-black text-white">
                      {course.instructor?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="truncate max-w-[120px] text-gray-600 dark:text-gray-300">
                      {course.instructor?.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-primary-500 uppercase group-hover:underline flex items-center gap-0.5">
                    View Course <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Courses;
