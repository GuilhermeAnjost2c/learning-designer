
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
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import { useUserStore, UserRole } from "./store/userStore";

// Protected route component with role-based access control
const ProtectedRoute = ({ 
  children, 
  allowedRoles = ['admin', 'manager', 'instructor', 'student']  
}: { 
  children: JSX.Element, 
  allowedRoles?: UserRole[] 
}) => {
  const { isAuthenticated, currentUser } = useUserStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (currentUser && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" />;
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
      </Router>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
