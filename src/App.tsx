
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { Layout } from "./components/layout/Layout";
import CourseDetail from "./pages/CourseDetail";
import CoursesList from "./pages/CoursesList";
import CreateCourse from "./pages/CreateCourse";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import DynamicsBank from "./pages/DynamicsBank";
import EduAI from "./pages/EduAI";
import Login from "./pages/Login";
import Setup from "./pages/Setup";
import Admin from "./pages/Admin";
import { useUserStore, UserRole } from "./store/userStore";
import { useEffect, useState } from "react";
import { supabase } from "./integrations/supabase/client";
import { Loader2 } from "lucide-react";

// Protected route component with role-based access control
const ProtectedRoute = ({ 
  children, 
  allowedRoles = ['admin', 'manager', 'instructor', 'student']  
}: { 
  children: JSX.Element, 
  allowedRoles?: UserRole[] 
}) => {
  const { isAuthenticated, currentUser, setCurrentUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        
        if (data.session?.user) {
          const user = data.session.user;
          // Atualizar o usuário atual com os dados da sessão
          setCurrentUser({
            id: user.id,
            email: user.email || '',
            name: user.user_metadata?.name || '',
            role: user.user_metadata?.role || 'student',
            department: user.user_metadata?.department,
            avatar: user.user_metadata?.avatar,
          });
        }
      } catch (error) {
        console.error("Error checking auth:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [setCurrentUser]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
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
          <Route path="/setup" element={<Setup />} />
          
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
            <Route path="edu" element={<EduAI />} />
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
