
import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { Toaster } from "@/components/ui/sonner";
import { useUserStore } from "@/store/userStore";

export const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const { isAuthenticated } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is not authenticated, redirect to login page
    if (!isAuthenticated) {
      navigate("/login");
    }

    // Handle window resize to adjust sidebar on larger screens
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        // Auto-open sidebar on desktop (but don't force it closed if user has closed it)
        if (!sidebarOpen) {
          setSidebarOpen(true);
        }
      } else if (window.innerWidth < 768 && sidebarOpen) {
        // Auto-close sidebar on mobile
        setSidebarOpen(false);
      }
    };

    // Initialize correctly based on screen size
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isAuthenticated, navigate, sidebarOpen]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
          <Navbar toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
          <main className="flex-1 p-4 md:p-6 overflow-y-auto transition-all duration-300">
            <Outlet />
          </main>
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
};

export default Layout;
