import { Link } from 'react-router-dom';
import { GraduationCap, Home } from 'lucide-react';

const NotFound = () => (
  <div className="flex min-h-[80vh] bg-royal-lightBg dark:bg-royal-darkBg flex-col items-center justify-center px-4 text-center animate-fade-in">
    <GraduationCap className="mb-4 h-16 w-16 text-primary-500 animate-bounce" style={{ animationDuration: '3s' }} />
    <h1 className="text-7xl font-black text-primary-600 dark:text-primary-400 tracking-tight">404</h1>
    <p className="mt-4 text-xl font-bold text-gray-900 dark:text-white">Page not found</p>
    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">The page you're looking for doesn't exist or has been moved.</p>
    <Link to="/" className="btn-primary mt-6 py-2.5 px-6">
      <Home className="h-4 w-4" /> Back to Home
    </Link>
  </div>
);

export default NotFound;
