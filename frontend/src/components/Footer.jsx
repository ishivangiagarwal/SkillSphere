import { Link } from 'react-router-dom';
import { GraduationCap, Github, Linkedin, Twitter } from 'lucide-react';

const Footer = () => (
  <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
    <div className="page-container grid grid-cols-1 gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <div className="flex items-center gap-2 text-lg font-extrabold text-primary-600">
          <GraduationCap className="h-6 w-6" /> SkillSphere
        </div>
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
          AI-powered learning and collaboration platform for students and mentors.
        </p>
      </div>
      <div>
        <h4 className="mb-3 text-sm font-semibold">Platform</h4>
        <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
          <li><Link to="/courses" className="hover:text-primary-600">Courses</Link></li>
          <li><Link to="/community" className="hover:text-primary-600">Community</Link></li>
          <li><Link to="/ai-assistant" className="hover:text-primary-600">AI Assistant</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="mb-3 text-sm font-semibold">Account</h4>
        <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
          <li><Link to="/login" className="hover:text-primary-600">Login</Link></li>
          <li><Link to="/register" className="hover:text-primary-600">Register</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="mb-3 text-sm font-semibold">Connect</h4>
        <div className="flex gap-3 text-gray-400">
          <Github className="h-5 w-5 hover:text-primary-600" />
          <Linkedin className="h-5 w-5 hover:text-primary-600" />
          <Twitter className="h-5 w-5 hover:text-primary-600" />
        </div>
      </div>
    </div>
    <div className="border-t border-gray-100 dark:border-gray-900 py-4 text-center text-xs text-gray-400">
      © {new Date().getFullYear()} SkillSphere. Built with the MERN stack.
    </div>
  </footer>
);

export default Footer;
