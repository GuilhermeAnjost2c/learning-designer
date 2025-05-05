
import { Home, BookOpen, Database, UserCog, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { NavLink, useLocation } from "react-router-dom";
import { useUserStore } from "@/store/userStore";
import { motion } from "framer-motion";
import { useEffect } from "react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const { currentUser } = useUserStore();
  const location = useLocation();
  // Only display the admin link for admin or manager users
  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'manager';
  
  const navItems = [
    { name: "Dashboard", icon: Home, path: "/" },
    { name: "Cursos", icon: BookOpen, path: "/courses" },
    { name: "Banco de Dinâmicas", icon: Database, path: "/dynamics" },
  ];
  
  // Add admin link if user is admin or manager
  if (isAdmin) {
    navItems.push({ name: "Administração", icon: UserCog, path: "/admin" });
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
      {/* Mobile backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-30 lg:hidden transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={closeSidebar}
        aria-hidden="true"
      />
      
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isOpen ? "16rem" : "0rem",
          opacity: isOpen ? 1 : 0,
          x: isOpen ? 0 : -40,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "h-screen bg-white shadow-lg z-40 flex-shrink-0 overflow-hidden",
          "fixed lg:sticky top-0 left-0",
          "lg:opacity-100 lg:translate-x-0",
          !isOpen && "lg:!w-16 lg:!opacity-100 lg:!translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center h-16 border-b px-4">
            {isOpen ? (
              <h1 className="text-xl font-bold text-primary transition-opacity duration-200">
                Learning Designer
              </h1>
            ) : (
              <span className="hidden lg:block text-xl font-bold text-primary text-center w-full">
                LD
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={closeSidebar}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex-1 py-4 overflow-y-auto">
            <ul className="space-y-2 px-2">
              {navItems.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    end={item.path === "/"}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-secondary"
                      )
                    }
                  >
                    <item.icon className="w-5 h-5 min-w-[20px]" />
                    {isOpen && (
                      <span className="transition-opacity duration-200 whitespace-nowrap">
                        {item.name}
                      </span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="p-4 border-t">
            {isOpen && (
              <div className="text-xs text-muted-foreground text-center transition-opacity duration-200">
                © 2025 Learning Designer
              </div>
            )}
          </div>
        </div>
      </motion.aside>
    </>
  );
};
