
import { Home, BookOpen, Database, Baby } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
}

export const Sidebar = ({ isOpen }: SidebarProps) => {
  const navItems = [
    { name: "Dashboard", icon: Home, path: "/" },
    { name: "Cursos", icon: BookOpen, path: "/courses" },
    { name: "Banco de Dinâmicas", icon: Database, path: "/dynamics" },
    { name: "Edu", icon: Baby, path: "/edu" },
  ];

  return (
    <aside
      className={cn(
        "h-screen bg-white shadow-lg z-40 w-64 flex-shrink-0",
        "fixed lg:sticky top-0 left-0",
        isOpen ? "block" : "hidden lg:block"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-center items-center h-16 border-b">
          <h1 className="text-xl font-bold text-primary">Learning Designer</h1>
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
            © 2025 Learning Designer
          </div>
        </div>
      </div>
    </aside>
  );
};
