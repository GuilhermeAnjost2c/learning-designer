
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";
import { useUserManagement } from "@/hooks/useUserManagement";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Setup = () => {
  const navigate = useNavigate();
  const { createUser, isLoading } = useUserManagement();
  const [adminEmail, setAdminEmail] = useState("admin@example.com");
  const [adminPassword, setAdminPassword] = useState("admin123");
  const [adminName, setAdminName] = useState("Administrador");
  
  const [userEmail, setUserEmail] = useState("instructor@example.com");
  const [userPassword, setUserPassword] = useState("instructor123");
  const [userName, setUserName] = useState("Instrutor");
  const [userDepartment, setUserDepartment] = useState("RH");
  const [role, setRole] = useState("instructor");
  
  const [setupComplete, setSetupComplete] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/courses');
      } else {
        setCheckingSession(false);
      }
    };
    
    checkSession();
  }, [navigate]);

  const handleCreateAdmin = async () => {
    try {
      const result = await createUser(adminEmail, adminPassword, {
        name: adminName,
        role: "admin"
      });
      
      if (result) {
        toast.success("Administrador criado com sucesso!");
      }
    } catch (error) {
      toast.error("Erro ao criar administrador: " + error.message);
    }
  };
  
  const handleCreateUser = async () => {
    try {
      const result = await createUser(userEmail, userPassword, {
        name: userName,
        role,
        department: userDepartment
      });
      
      if (result) {
        toast.success(`${role === 'instructor' ? 'Instrutor' : 'Usuário'} criado com sucesso!`);
      }
    } catch (error) {
      toast.error(`Erro ao criar ${role === 'instructor' ? 'instrutor' : 'usuário'}: ` + error.message);
    }
  };
  
  const handleCompleteSetup = () => {
    setSetupComplete(true);
    toast.success("Setup concluído! Agora você pode fazer login.");
  };
  
  if (checkingSession) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-20 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">Configuração Inicial</h1>
          <p className="text-muted-foreground">
            Crie os primeiros usuários para começar a usar o sistema Learning Designer.
          </p>
        </div>
        
        {setupComplete ? (
          <Card>
            <CardHeader>
              <CardTitle>Setup concluído!</CardTitle>
              <CardDescription>
                Agora você pode acessar o sistema com os usuários que você criou.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Administrador</h3>
                  <p className="text-sm text-muted-foreground">Email: {adminEmail}</p>
                  <p className="text-sm text-muted-foreground">Senha: {adminPassword}</p>
                </div>
                
                <div>
                  <h3 className="font-medium">Instrutor</h3>
                  <p className="text-sm text-muted-foreground">Email: {userEmail}</p>
                  <p className="text-sm text-muted-foreground">Senha: {userPassword}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => navigate('/login')} className="w-full">
                Ir para Login
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Criar Administrador</CardTitle>
                <CardDescription>
                  O administrador terá acesso completo ao sistema.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-name">Nome</Label>
                    <Input 
                      id="admin-name" 
                      value={adminName} 
                      onChange={(e) => setAdminName(e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Email</Label>
                    <Input 
                      id="admin-email" 
                      type="email" 
                      value={adminEmail} 
                      onChange={(e) => setAdminEmail(e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-password">Senha</Label>
                    <Input 
                      id="admin-password" 
                      type="text" 
                      value={adminPassword} 
                      onChange={(e) => setAdminPassword(e.target.value)} 
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleCreateAdmin} 
                  disabled={isLoading || !adminEmail || !adminPassword || !adminName}
                  className="w-full"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Criar Administrador
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Criar Usuário</CardTitle>
                <CardDescription>
                  Crie um instrutor ou gerente para testar o sistema.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="user-name">Nome</Label>
                    <Input 
                      id="user-name" 
                      value={userName} 
                      onChange={(e) => setUserName(e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user-email">Email</Label>
                    <Input 
                      id="user-email" 
                      type="email" 
                      value={userEmail} 
                      onChange={(e) => setUserEmail(e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user-password">Senha</Label>
                    <Input 
                      id="user-password" 
                      type="text" 
                      value={userPassword} 
                      onChange={(e) => setUserPassword(e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user-role">Função</Label>
                    <Select value={role} onValueChange={setRole}>
                      <SelectTrigger id="user-role">
                        <SelectValue placeholder="Selecione a função" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instructor">Instrutor</SelectItem>
                        <SelectItem value="manager">Gerente</SelectItem>
                        <SelectItem value="student">Aluno</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user-department">Departamento</Label>
                    <Select value={userDepartment} onValueChange={setUserDepartment}>
                      <SelectTrigger id="user-department">
                        <SelectValue placeholder="Selecione o departamento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="RH">Recursos Humanos</SelectItem>
                        <SelectItem value="TI">Tecnologia da Informação</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Vendas">Vendas</SelectItem>
                        <SelectItem value="Financeiro">Financeiro</SelectItem>
                        <SelectItem value="Operações">Operações</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleCreateUser} 
                  disabled={isLoading || !userEmail || !userPassword || !userName}
                  className="w-full"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Criar Usuário
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
        
        {!setupComplete && (
          <div className="flex justify-center">
            <Button 
              variant="outline" 
              size="lg" 
              onClick={handleCompleteSetup}
              className="mt-4"
            >
              Concluir Setup
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Setup;
