import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import MainLayout from './layouts/MainLayout';
import SidebarLayout from './layouts/SidebarLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import StudentDashboard from './pages/StudentDashboard';
import MentorDashboard from './pages/MentorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import CreateCourse from './pages/CreateCourse';
import AIAssistant from './pages/AIAssistant';
import Community from './pages/Community';
import ResumeBuilder from './pages/ResumeBuilder';
import NotFound from './pages/NotFound';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import Notes from './pages/Notes';

const DynamicLayout = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <SidebarLayout /> : <MainLayout />;
};

const DashboardRedirect = () => {
  const { user } = useAuth();
  if (user?.role === 'admin') return <Navigate to="/admin" replace />;
  if (user?.role === 'mentor') return <Navigate to="/mentor/dashboard" replace />;
  return <StudentDashboard />;
};

function App() {
  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
        </Route>

        <Route element={<DynamicLayout />}>
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<SidebarLayout />}>
            <Route path="/dashboard" element={<DashboardRedirect />} />
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
            <Route path="/community" element={<Community />} />
            <Route path="/resume-builder" element={<ResumeBuilder />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/notes" element={<Notes />} />

            <Route element={<ProtectedRoute allowedRoles={['mentor', 'admin']} />}>
              <Route path="/courses/create" element={<CreateCourse />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['mentor']} />}>
              <Route path="/mentor/dashboard" element={<MentorDashboard />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
