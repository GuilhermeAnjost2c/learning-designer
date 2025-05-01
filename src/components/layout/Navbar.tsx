
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MenuIcon, Search, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger, 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserStore } from "@/store/userStore";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface NavbarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const Navbar = ({ isOpen, setIsOpen }: NavbarProps) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useUserStore();
  const [searchQuery, setSearchQuery] = useState("");

  const pageTitles: Record<string, string> = {
    "/": "Dashboard",
    "/courses": "Cursos",
    "/courses/new": "Novo Curso",
    "/dynamics": "Banco de Dinâmicas",
    "/edu": "Edu",
    "/admin": "Administração",
  };

  const getTitle = () => {
    if (pathname.startsWith("/courses/") && pathname !== "/courses/new") {
      return "Detalhes do Curso";
    }
    return pageTitles[pathname] || "Learning Designer";
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implementar busca
      console.log("Searching for:", searchQuery);
      // Redirecionar para resultados da busca
    }
  };
  
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logout realizado com sucesso");
      navigate("/login");
    } catch (error) {
      toast.error("Erro ao fazer logout: " + error.message);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        <MenuIcon className="h-6 w-6" />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      
      <div className="flex-1">
        <h1 className="text-xl font-semibold">{getTitle()}</h1>
      </div>

      <form 
        onSubmit={handleSearch}
        className={cn(
          "relative hidden md:flex w-full max-w-sm items-center transition-opacity",
          pathname === "/login" && "opacity-0 pointer-events-none"
        )}
      >
        <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="pl-8 bg-background"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </form>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full border overflow-hidden"
            aria-label="User menu"
          >
            <Avatar>
              <AvatarImage 
                src={currentUser?.avatar || undefined} 
                alt={currentUser?.name || "User"} 
              />
              <AvatarFallback>
                {currentUser?.name ? getInitials(currentUser.name) : "U"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            <div className="flex flex-col">
              <span>{currentUser?.name}</span>
              <span className="text-xs text-muted-foreground">{currentUser?.email}</span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <div className="flex flex-col">
              <span className="text-xs font-medium">Função</span>
              <span className="text-sm">
                {currentUser?.role === 'admin' ? 'Administrador' : 
                 currentUser?.role === 'manager' ? 'Gerente' : 
                 currentUser?.role === 'instructor' ? 'Instrutor' : 'Aluno'}
              </span>
            </div>
          </DropdownMenuItem>
          {currentUser?.department && (
            <DropdownMenuItem>
              <div className="flex flex-col">
                <span className="text-xs font-medium">Departamento</span>
                <span className="text-sm">{currentUser.department}</span>
              </div>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={handleLogout}
            className="text-destructive focus:text-destructive"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};
