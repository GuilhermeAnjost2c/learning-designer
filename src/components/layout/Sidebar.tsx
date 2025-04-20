
import { Home, BookOpen, Database, Bot, UserCog, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { useUserStore } from "@/store/userStore";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const { currentUser } = useUserStore();
  const isAdmin = currentUser?.role === 'admin';
  
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

  return (
    <aside
      className={cn(
        "h-screen bg-white shadow-lg z-40 w-64 flex-shrink-0",
        "fixed lg:sticky top-0 left-0 transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-20"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center h-16 border-b px-4">
          <h1 className={cn(
            "text-xl font-bold text-primary transition-opacity duration-200",
            !isOpen && "lg:opacity-0"
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
                  <span className={cn("transition-opacity duration-200", !isOpen && "lg:hidden")}>
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
            !isOpen && "lg:opacity-0"
          )}>
            © 2025 Learning Designer
          </div>
        </div>
      </div>
    </aside>
  );
};
