
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
import { useEffect } from "react";
import { supabase } from "./integrations/supabase/client";
import { DepartmentName } from "./types/course";

// Protected route component with role-based access control
const ProtectedRoute = ({ 
  children, 
  allowedRoles = ['admin', 'manager', 'instructor', 'student']  
}: { 
  children: JSX.Element, 
  allowedRoles?: UserRole[] 
}) => {
  const { isAuthenticated, currentUser } = useUserStore();
  
  console.log("Protected route check:", { isAuthenticated, currentUser, allowedRoles });
  
  if (!isAuthenticated) {
    console.log("User not authenticated, redirecting to login");
    return <Navigate to="/login" />;
  }
  
  if (currentUser && !allowedRoles.includes(currentUser.role)) {
    console.log("User role not allowed:", currentUser.role);
    return <Navigate to="/" />;
  }
  
  return children;
};

function App() {
  const { setCurrentUser, logout } = useUserStore();

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      console.log("Checking for existing Supabase session");
      const { data } = await supabase.auth.getSession();
      
      console.log("Session data:", data);
      
      if (data?.session?.user) {
        console.log("Found existing session for user:", data.session.user.id);
        // Fetch profile data
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.session.user.id)
          .single();
        
        console.log("Profile data:", profileData);
        
        if (profileData) {
          setCurrentUser({
            id: data.session.user.id,
            name: profileData.name || data.session.user.email!,
            email: data.session.user.email!,
            role: profileData.role as UserRole,
            department: profileData.department as DepartmentName,
          });
        }
      } else {
        console.log("No session found");
      }
    };
    
    checkSession();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state change:", event, session?.user?.id);
        
        if (event === 'SIGNED_OUT') {
          console.log("User signed out");
          logout();
        } else if (event === 'SIGNED_IN' && session) {
          console.log("User signed in:", session.user.id);
          // Fetch profile data
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          console.log("Profile data after sign in:", profileData);
          
          if (profileData) {
            setCurrentUser({
              id: session.user.id,
              name: profileData.name || session.user.email!,
              email: session.user.email!,
              role: profileData.role as UserRole,
              department: profileData.department as DepartmentName,
            });
          }
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, [setCurrentUser, logout]);

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
            <Route path="dashboard" element={<Dashboard />} />
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
