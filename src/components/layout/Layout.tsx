
import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { Toaster } from "@/components/ui/sonner";
import { useUserStore } from "@/store/userStore";
import { useCourseStore } from "@/store/courseStore";
import { supabase } from '@/integrations/supabase/client';

export const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const { currentUser, setCurrentUser, isAuthenticated } = useUserStore();
  const { fetchCoursesFromSupabase } = useCourseStore();
  const navigate = useNavigate();

  // Handle auth state changes
  useEffect(() => {
    // Set up authentication listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          // User is signed in
          const { user } = session;
          if (user && user.user_metadata) {
            setCurrentUser({
              id: user.id,
              email: user.email || '',
              name: user.user_metadata.name || '',
              role: user.user_metadata.role || 'student',
              department: user.user_metadata.department,
              avatar: user.user_metadata.avatar,
            });
            
            // Load courses from Supabase when user signs in
            fetchCoursesFromSupabase();
          }
        } else if (event === 'SIGNED_OUT') {
          // User is signed out
          setCurrentUser(null);
          navigate('/login');
        }
      }
    );

    // Initial session check
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error checking auth status:', error);
        navigate('/login');
        return;
      }
      
      if (data.session?.user) {
        const { user } = data.session;
        // Set the current user from session data
        if (user && user.user_metadata) {
          setCurrentUser({
            id: user.id,
            email: user.email || '',
            name: user.user_metadata.name || '',
            role: user.user_metadata.role || 'student',
            department: user.user_metadata.department,
            avatar: user.user_metadata.avatar,
          });
          
          // Load courses from Supabase on initial load
          fetchCoursesFromSupabase();
        }
      } else {
        // Redirect to login if no session
        navigate('/login');
      }
    };
    
    checkSession();

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [setCurrentUser, navigate, fetchCoursesFromSupabase]);

  useEffect(() => {
    // If user is not authenticated, redirect to login page
    if (!isAuthenticated && !currentUser) {
      navigate("/login");
    }

    // Handle window resize to adjust sidebar on larger screens
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        // Only auto-open sidebar if the window width becomes large
        if (!sidebarOpen) {
          setSidebarOpen(true);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isAuthenticated, navigate, sidebarOpen, currentUser]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (!isAuthenticated) {
    return null; // Don't render anything while checking auth
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Overlay for mobile when sidebar is open */}
      <div 
        className={`fixed inset-0 bg-black/50 z-30 lg:hidden transition-opacity ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`} 
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />
      
      {/* Sidebar component with proper animation */}
      <div className={`
        fixed left-0 top-0 z-40 h-full
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0
        `}>
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      </div>
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        <Navbar onToggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <Toaster position="top-right" />
    </div>
  );
};

export default Layout;
