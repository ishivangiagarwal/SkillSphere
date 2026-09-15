import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Star,
  ArrowRight,
  Code2,
  Database,
  Smartphone,
  Boxes,
  BrainCircuit,
  Terminal,
  BookOpen,
  Bot,
  Users,
  FileText,
  Clock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import * as courseService from '../services/courseService';
import Loader from '../components/Loader';

const CATEGORY_VISUALS = {
  'Web Development': { icon: Code2, gradient: 'from-primary-500 to-primary-700' },
  'Data Science': { icon: Database, gradient: 'from-emerald-500 to-teal-600' },
  'Mobile Development': { icon: Smartphone, gradient: 'from-fuchsia-500 to-pink-600' },
  DevOps: { icon: Boxes, gradient: 'from-coral-500 to-amber-600' },
  'AI & ML': { icon: BrainCircuit, gradient: 'from-violet-500 to-purple-700' },
  'Programming Basics': { icon: Terminal, gradient: 'from-cyan-500 to-sky-600' },
};

const TABS = ['All', 'Web Development', 'Data Science', 'Mobile Development', 'DevOps', 'AI & ML'];

const PARTNERS = ['GitHub', 'MongoDB', 'Vercel', 'Slack', 'Notion', 'Figma'];

const Landing = () => {
  const { isAuthenticated } = useAuth();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await courseService.getCourses();
        setCourses(res.courses);
      } catch {
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = courses
    .filter((c) => activeTab === 'All' || c.category === activeTab)
    .slice(0, 6);

  return (
    <div className="bg-white dark:bg-gray-950">
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary-50 dark:bg-gray-900">
        <div className="absolute -top-16 -right-16 h-72 w-72 rounded-full bg-primary-200/50 blur-3xl dark:bg-primary-800/20" />
        <div className="absolute bottom-0 left-1/4 h-56 w-56 rounded-full bg-coral-300/30 blur-3xl dark:bg-coral-700/10" />

        <div className="page-container relative grid grid-cols-1 items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          {/* Left: copy + search */}
          <div className="animate-slide-up">
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white sm:text-5xl">
              Best courses are <span className="text-primary-600">waiting</span> to
              enrich your skill
            </h1>
            <p className="mt-5 max-w-md text-gray-600 dark:text-gray-400">
              SkillSphere pairs structured courses with an AI learning assistant so you
              always know exactly what to study next.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                window.location.href = `/courses${search ? `?search=${encodeURIComponent(search)}` : ''}`;
              }}
              className="mt-8 flex max-w-md items-center gap-2 rounded-full border border-gray-200 bg-white p-1.5 pl-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >
              <Search className="h-5 w-5 flex-shrink-0 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="What do you want to learn?"
                className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
              />
              <button type="submit" className="btn-primary flex-shrink-0 !rounded-full !py-2.5">
                Explore
              </button>
            </form>

            <div className="mt-8">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Trusted tools our mentors teach
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-semibold text-gray-400 dark:text-gray-600">
                {PARTNERS.map((p) => (
                  <span key={p}>{p}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: illustrative stat cluster instead of a stock illustration */}
          <div className="relative animate-fade-in">
            <div className="mx-auto max-w-sm rounded-3xl bg-gradient-to-br from-primary-600 to-primary-800 p-8 text-white shadow-xl">
              <BrainCircuit className="h-10 w-10 opacity-90" />
              <p className="mt-4 text-lg font-bold">AI Learning Assistant</p>
              <p className="mt-1 text-sm text-primary-100">
                Ask questions, get roadmaps, and generate quizzes on demand.
              </p>
              <div className="mt-6 rounded-xl bg-white/10 p-4 text-sm backdrop-blur-sm">
                "Explain closures in JavaScript with an example"
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-lg dark:bg-gray-800">
              <div className="flex -space-x-2">
                {['S', 'A', 'R'].map((letter) => (
                  <div
                    key={letter}
                    className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-primary-500 text-xs font-bold text-white dark:border-gray-800"
                  >
                    {letter}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-0.5 text-coral-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Loved by learners</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Courses */}
      <section className="page-container py-20">
        <div className="mb-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">Explore</p>
            <h2 className="mt-1 text-3xl font-extrabold text-gray-900 dark:text-white">Popular Courses</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <Loader />
        ) : filteredCourses.length === 0 ? (
          <p className="py-16 text-center text-gray-400">No courses in this category yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => {
              const visual = CATEGORY_VISUALS[course.category] || { icon: BookOpen, gradient: 'from-primary-500 to-primary-700' };
              const VisualIcon = visual.icon;
              return (
                <Link
                  key={course._id}
                  to={`/courses/${course._id}`}
                  className="group card overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all"
                >
                  <div className={`flex h-32 items-center justify-center bg-gradient-to-br ${visual.gradient} text-white`}>
                    <VisualIcon className="h-10 w-10 opacity-90" strokeWidth={1.5} />
                  </div>
                  <div className="p-5">
                    <span className="text-xs font-semibold text-primary-600">{course.category}</span>
                    <h3 className="mt-1 font-semibold text-gray-900 dark:text-white line-clamp-1">{course.title}</h3>
                    <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                      <span>By {course.instructor?.name}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> {course.duration}h
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link to="/courses" className="btn-secondary">
            View all courses <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Feature strip */}
      <section className="bg-primary-50 py-20 dark:bg-gray-900">
        <div className="page-container grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: BookOpen, title: 'Structured Courses', desc: 'Track lesson-by-lesson progress as you go.' },
            { icon: Bot, title: 'AI Assistant', desc: 'Roadmaps, quizzes, and code explanations on demand.' },
            { icon: Users, title: 'Community', desc: 'Share posts and learn alongside other students.' },
            { icon: FileText, title: 'Resume Builder', desc: 'Turn your progress into a downloadable resume.' },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-900/40 dark:text-primary-400">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{f.title}</h3>
              <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="page-container py-20 text-center">
        <div className="mx-auto max-w-2xl rounded-3xl bg-gradient-to-r from-primary-600 to-primary-800 p-10 text-white shadow-xl">
          <h2 className="text-2xl font-bold sm:text-3xl">Ready to start your journey?</h2>
          <p className="mt-3 text-primary-100">Join SkillSphere today — it's free to get started.</p>
          <Link
            to={isAuthenticated ? '/dashboard' : '/register'}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-semibold text-primary-700 hover:bg-gray-100"
          >
            {isAuthenticated ? 'Go to Dashboard' : 'Create Free Account'} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;