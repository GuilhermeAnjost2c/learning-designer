
import { Home, BookOpen, Database, Bot, UserCog, X, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { useUserStore } from "@/store/userStore";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const { currentUser } = useUserStore();
  const isAdmin = currentUser?.role === 'admin';
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  
  const navItems = [
    { name: "Dashboard", icon: Home, path: "/" },
    { name: "Cursos", icon: BookOpen, path: "/courses" },
    { name: "Banco de Dinâmicas", icon: Database, path: "/dynamics" },
    { name: "Edu", icon: Bot, path: "/edu" },
  ];
  
  // Add admin link if user is admin
  if (isAdmin) {
    navItems.push({ name: "Administração", icon: UserCog, path: "/admin" });
  }

  const closeSidebar = () => {
    setIsOpen(false);
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Window resize handler
  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 1024;
      setIsMobile(newIsMobile);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {isOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={closeSidebar}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
      
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isOpen ? (isMobile ? "240px" : "16rem") : "0px",
          opacity: isOpen ? 1 : 0,
          x: isOpen ? 0 : -40
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "h-screen bg-white dark:bg-gray-950 shadow-lg z-40 flex-shrink-0 overflow-hidden",
          "fixed lg:relative top-0 left-0"
        )}
      >
        <div className="flex flex-col h-full relative">
          {/* Retract button for desktop */}
          {!isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar}
              className="absolute -right-3 top-6 size-6 z-50 rounded-full border shadow-md bg-white dark:bg-gray-950 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ChevronLeft className={cn("h-4 w-4 transition-transform", !isOpen && "rotate-180")} />
            </Button>
          )}
          
          <div className="flex justify-between items-center h-16 border-b px-4">
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.h1
                  key="full-logo"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xl font-bold text-primary"
                >
                  Learning Designer
                </motion.h1>
              ) : (
                <motion.span
                  key="compact-logo"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xl font-bold text-primary"
                >
                  LD
                </motion.span>
              )}
            </AnimatePresence>
            
            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={closeSidebar}
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
          
          <div className="flex-1 py-4 overflow-y-auto">
            <ul className="space-y-2 px-2">
              {navItems.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-secondary"
                      )
                    }
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <AnimatePresence mode="wait">
                      {isOpen && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2 }}
                          className="whitespace-nowrap overflow-hidden"
                        >
                          {item.name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="p-4 border-t">
            <AnimatePresence mode="wait">
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-muted-foreground text-center"
                >
                  © 2025 Learning Designer
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>
    </>
  );
};
