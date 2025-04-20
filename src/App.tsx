
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "./components/ui/toaster";
import { Layout } from "./components/layout/Layout";
import CourseDetail from "./pages/CourseDetail";
import CoursesList from "./pages/CoursesList";
import CreateCourse from "./pages/CreateCourse";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import DynamicsBank from "./pages/DynamicsBank";
import EduAI from "./pages/EduAI";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import { useUserStore } from "./store/userStore";
import { useCourseStore } from "./store/courseStore";

// Protected route component
const ProtectedRoute = ({ children, requireAdmin = false }: { children: JSX.Element, requireAdmin?: boolean }) => {
  const { isAuthenticated, currentUser } = useUserStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (requireAdmin && currentUser?.role !== 'admin') {
    return <Navigate to="/" />;
  }
  
  return children;
};

// Course access control route
const CourseAccessRoute = ({ children }: { children: JSX.Element }) => {
  const { currentUser } = useUserStore();
  const { isUserAuthorized } = useCourseStore();
  
  // Extract courseId from URL
  const path = window.location.pathname;
  const courseIdMatch = path.match(/\/courses\/([^\/]+)/);
  const courseId = courseIdMatch ? courseIdMatch[1] : null;
  
  // If no course ID or not authenticated, render children
  if (!courseId || !currentUser) {
    return children;
  }
  
  // Check if user has access to this course
  const hasAccess = isUserAuthorized(currentUser.id, courseId, currentUser.department);
  
  if (!hasAccess) {
    return <Navigate to="/courses" />;
  }
  
  return children;
};

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="courses" element={<CoursesList />} />
            <Route path="courses/new" element={<CreateCourse />} />
            <Route path="courses/:courseId" element={
              <CourseAccessRoute>
                <CourseDetail />
              </CourseAccessRoute>
            } />
            <Route path="dynamics" element={<DynamicsBank />} />
            <Route path="edu" element={<EduAI />} />
            <Route path="admin" element={
              <ProtectedRoute requireAdmin={true}>
                <Admin />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
