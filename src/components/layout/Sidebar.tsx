
import { Home, BookOpen, Database, UserCog, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { NavLink, useLocation } from "react-router-dom";
import { useUserStore } from "@/store/userStore";
import { motion } from "framer-motion";
import { useEffect } from "react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const { currentUser } = useUserStore();
  const location = useLocation();
  
  // Only display the admin link for admin or manager users
  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'manager';
  
  const navItems = [
    { name: "Dashboard", path: "/", icon: <Home className="h-5 w-5" /> },
    { name: "Cursos", path: "/courses", icon: <BookOpen className="h-5 w-5" /> },
    { name: "Dinâmicas", path: "/dynamics", icon: <Database className="h-5 w-5" /> },
  ];
  
  if (isAdmin) {
    navItems.push({
      name: "Administração",
      path: "/admin",
      icon: <UserCog className="h-5 w-5" />,
    });
  }

  const closeSidebar = () => {
    setIsOpen(false);
  };

  // On mobile, close sidebar when route changes
  useEffect(() => {
    if (window.innerWidth < 1024) {
      closeSidebar();
    }
  }, [location.pathname]);

  return (
    <>
      <div
        className={`fixed top-0 left-0 bottom-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile close button */}
          <div className="flex items-center justify-between px-4 py-3 border-b lg:hidden">
            <span className="font-semibold">Menu</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={closeSidebar}
              className="lg:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Sidebar header */}
          <div className="px-6 py-4 border-b hidden lg:block">
            <h1 className="text-xl font-bold">Learning Designer</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-3">
              {navItems.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    end={item.path === "/"}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                        isActive
                          ? "bg-primary text-white"
                          : "hover:bg-muted text-gray-600 hover:text-gray-900"
                      )
                    }
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};
