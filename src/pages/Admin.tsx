
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/userStore";

const Admin = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useUserStore();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    // Only admin or manager can access this page
    if (currentUser?.role !== 'admin' && currentUser?.role !== 'manager') {
      navigate("/");
      return;
    }
    
    setLoading(false);
  }, [currentUser, isAuthenticated, navigate]);
  
  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Carregando painel administrativo...</h2>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Painel Administrativo</h2>
        <p>Bem-vindo ao painel de administração, {currentUser?.name}!</p>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border rounded-lg p-4 bg-blue-50">
            <h3 className="font-bold mb-2">Gerenciamento de Usuários</h3>
            <p className="text-sm text-gray-600">Gerencie os usuários do sistema, suas permissões e papéis.</p>
          </div>
          
          <div className="border rounded-lg p-4 bg-green-50">
            <h3 className="font-bold mb-2">Relatórios</h3>
            <p className="text-sm text-gray-600">Visualize dados e estatísticas sobre cursos e treinamentos.</p>
          </div>
          
          <div className="border rounded-lg p-4 bg-purple-50">
            <h3 className="font-bold mb-2">Configurações</h3>
            <p className="text-sm text-gray-600">Ajuste as configurações do sistema e preferências.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
