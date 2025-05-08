
import { useUserStore } from "@/store/userStore";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { 
  LayoutDashboard, 
  BookOpen, 
  FolderKanban,
  Users,
  Settings,
  LogOut,
  PlusCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

const SidebarLink = ({
  to,
  icon: Icon,
  label,
  active
}: {
  to: string;
  icon: React.ElementType;
  label: string;
  active: boolean;
}) => {
  return (
    <Link to={to}>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-3",
          active && "bg-muted"
        )}
      >
        <Icon className="h-5 w-5" />
        <span>{label}</span>
      </Button>
    </Link>
  );
};

export function Sidebar() {
  const { pathname } = useLocation();
  const { currentUser, logout } = useUserStore();

  // Log user role for debugging
  useEffect(() => {
    console.log("Current user role in Sidebar:", currentUser?.role);
  }, [currentUser]);

  const handleLogout = async () => {
    await logout();
  };

  const isAdmin = currentUser?.role === "admin" || currentUser?.role === "manager";

  return (
    <div className="w-[250px] border-r h-screen flex flex-col p-4">
      <div className="font-bold text-lg mb-8 px-4 flex items-center gap-2">
        <FolderKanban className="h-6 w-6 text-primary" />
        <span>TrainingHub</span>
      </div>

      <nav className="space-y-1 flex-1">
        <SidebarLink
          to="/dashboard"
          icon={LayoutDashboard}
          label="Dashboard"
          active={pathname === "/dashboard" || pathname === "/"}
        />
        <SidebarLink
          to="/courses"
          icon={BookOpen}
          label="Cursos"
          active={pathname.startsWith("/courses")}
        />
        <SidebarLink
          to="/dynamics"
          icon={PlusCircle}
          label="Banco de Dinâmicas"
          active={pathname === "/dynamics"}
        />
        
        {isAdmin && (
          <>
            <Separator className="my-4" />
            <div className="px-4 py-2 text-xs font-semibold text-muted-foreground">
              Administração
            </div>
            <SidebarLink
              to="/admin"
              icon={Users}
              label="Usuários"
              active={pathname === "/admin"}
            />
            <SidebarLink
              to="/settings"
              icon={Settings}
              label="Configurações"
              active={pathname === "/settings"}
            />
          </>
        )}
      </nav>

      <div>
        <Separator className="my-4" />
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            {currentUser?.name?.charAt(0) || "U"}
          </div>
          <div className="flex-1 truncate">
            <p className="text-sm font-medium truncate">{currentUser?.name}</p>
            <p className="text-xs text-muted-foreground">{currentUser?.role}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
