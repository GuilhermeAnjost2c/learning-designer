import {
  Sun,
  Moon,
  LogOut,
  User,
  BookOpen,
} from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "@/hooks/useAuth";

export const Navbar = () => {
  const { pathname } = useLocation();
  const theme = useTheme();
  const { toggleTheme } = useTheme();
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
  };

  const renderUserMenu = () => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={profile?.avatar_url || ''} alt={profile?.name || "Usuário"} />
              <AvatarFallback>{(profile?.name?.charAt(0) || "U").toUpperCase()}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => navigate('/profile')} 
            className="cursor-pointer"
          >
            <User className="mr-2 h-4 w-4" />
            <span>Perfil</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sair</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <nav className="border-b bg-background flex h-14 items-center px-4 gap-4">
      <Link to="/" className="flex items-center gap-2 font-semibold mr-4">
        <BookOpen className="h-5 w-5 text-primary" />
        <span>Learning Designer</span>
      </Link>

      {pathname !== "/" && (
        <Link to="/" className="hover:underline">
          Dashboard
        </Link>
      )}
      {pathname !== "/courses" && (
        <Link to="/courses" className="hover:underline">
          Cursos
        </Link>
      )}
      {pathname !== "/dynamics" && (
        <Link to="/dynamics" className="hover:underline">
          Dinâmicas
        </Link>
      )}
      {profile?.role === 'admin' && pathname !== "/admin" && (
        <Link to="/admin" className="hover:underline">
          Admin
        </Link>
      )}

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
          <span className="sr-only">Alternar tema</span>
        </button>

        {user ? renderUserMenu() : (
          <Button variant="outline" onClick={() => navigate('/auth')}>
            Entrar
          </Button>
        )}
      </div>
    </nav>
  );
};
