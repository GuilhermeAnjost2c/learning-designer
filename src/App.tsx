
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
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import { AuthProvider, useAuth } from "./hooks/useAuth";

// Protected route component with role-based access control
const ProtectedRoute = ({ 
  children, 
  allowedRoles = ['admin', 'manager', 'instructor', 'user', 'student']  
}: { 
  children: JSX.Element, 
  allowedRoles?: string[] 
}) => {
  return <AuthProvider>
    <AuthCheck allowedRoles={allowedRoles}>
      {children}
    </AuthCheck>
  </AuthProvider>;
};

// Check authentication and role
const AuthCheck = ({ 
  children, 
  allowedRoles 
}: { 
  children: JSX.Element, 
  allowedRoles: string[] 
}) => {
  // We'll access useAuth inside this component which is wrapped by AuthProvider
  const { user, profile, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
    </div>;
  }
  
  if (!user) {
    return <Navigate to="/auth" />;
  }
  
  const userRole = profile?.role || 'user';
  
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" />;
  }
  
  return children;
};

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="courses" element={<CoursesList />} />
              <Route path="courses/new" element={
                <ProtectedRoute allowedRoles={['admin', 'instructor', 'manager']}>
                  <CreateCourse />
                </ProtectedRoute>
              } />
              <Route path="courses/:courseId" element={<CourseDetail />} />
              <Route path="dynamics" element={
                <ProtectedRoute allowedRoles={['admin', 'instructor', 'manager']}>
                  <DynamicsBank />
                </ProtectedRoute>
              } />
              <Route path="admin" element={
                <ProtectedRoute allowedRoles={['admin', 'manager']}>
                  <Admin />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
