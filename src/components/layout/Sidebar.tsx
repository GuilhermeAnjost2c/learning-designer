
import { Home, BookOpen, Database, Bot, UserCog, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { useUserStore } from "@/store/userStore";
import { motion } from "framer-motion";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const { currentUser } = useUserStore();
  const isAdmin = currentUser?.role === 'admin';
  const isManager = currentUser?.role === 'manager';
  
  const navItems = [
    { name: "Dashboard", icon: Home, path: "/", access: ['admin', 'manager', 'instructor', 'student'] },
    { name: "Cursos", icon: BookOpen, path: "/courses", access: ['admin', 'manager', 'instructor', 'student'] },
    { name: "Banco de Dinâmicas", icon: Database, path: "/dynamics", access: ['admin', 'manager', 'instructor', 'student'] },
    { name: "Edu", icon: Bot, path: "/edu", access: ['admin', 'manager', 'instructor', 'student'] },
    { name: "Administração", icon: UserCog, path: "/admin", access: ['admin', 'manager'] },
  ];
  
  const filteredNavItems = navItems.filter(item => 
    currentUser && item.access.includes(currentUser.role)
  );

  const closeSidebar = () => {
    setIsOpen(false);
  };

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
      <div 
        className={cn(
          "h-screen fixed lg:sticky top-0 left-0 z-40 bg-white shadow-lg flex-shrink-0 transition-all duration-300",
          isOpen ? "w-64 translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-20",
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center h-16 border-b px-4">
            <h1 className={cn(
              "text-xl font-bold text-primary transition-opacity duration-300",
              !isOpen && "lg:hidden"
            )}>
              Learning Designer
            </h1>
            {!isOpen && (
              <span className="hidden lg:block text-xl font-bold text-primary">LD</span>
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
              {filteredNavItems.map((item) => (
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
                    <span className={cn(
                      "transition-opacity duration-200", 
                      !isOpen && "lg:hidden"
                    )}>
                      {item.name}
                    </span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="p-4 border-t">
            <div className={cn(
              "text-xs text-muted-foreground text-center transition-opacity duration-200",
              !isOpen && "lg:hidden"
            )}>
              © 2025 Learning Designer
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
