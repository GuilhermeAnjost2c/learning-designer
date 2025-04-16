
import { Home, BookOpen, Calendar, Users, BarChart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
}

export const Sidebar = ({ isOpen }: SidebarProps) => {
  const navItems = [
    { name: "Dashboard", icon: Home, path: "/" },
    { name: "Cursos", icon: BookOpen, path: "/courses" },
    { name: "Calendário", icon: Calendar, path: "/calendar" },
    { name: "Participantes", icon: Users, path: "/participants" },
    { name: "Relatórios", icon: BarChart, path: "/reports" },
  ];

  const sidebarVariants = {
    open: { 
      x: 0,
      width: '240px',
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      } 
    },
    closed: { 
      x: '-100%',
      width: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        delay: 0.1
      } 
    }
  };

  return (
    <>
      {/* Mobile overlay when sidebar is open */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
        />
      )}
      
      <motion.nav
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
        className={cn(
          "fixed top-0 left-0 h-full bg-white shadow-lg z-40 overflow-hidden lg:relative lg:translate-x-0 lg:w-64",
          isOpen ? "block" : "lg:block hidden"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-center items-center h-16 border-b">
            <h1 className="text-xl font-bold text-primary">Skill Path</h1>
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
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="p-4 border-t">
            <div className="text-xs text-muted-foreground text-center">
              © 2025 Skill Path Weaver
            </div>
          </div>
        </div>
      </motion.nav>
    </>
  );
};
