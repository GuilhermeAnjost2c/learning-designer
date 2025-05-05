
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useUserStore } from "@/store/userStore";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

type User = {
  id: string;
  email: string;
  name: string;
  role: string;
  department: string;
  createdAt: string;
};

type ApprovalRequest = {
  id: string;
  course_id: string;
  course_name?: string;
  request_date: string;
  requested_by: string;
  requester_name?: string;
  approver_id: string | null;
  approval_type: string;
  item_id: string | null;
  status: string;
  comments: string | null;
  review_date: string | null;
};

const Admin = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useUserStore();
  const [selectedTab, setSelectedTab] = useState<'users' | 'approvals'>('users');

  useEffect(() => {
    if (currentUser?.role === 'admin' || currentUser?.role === 'manager') {
      fetchUsers();
      fetchApprovals();
    }
  }, [currentUser]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setUsers(data.map(user => ({
        id: user.id,
        email: user.email || '',
        name: user.name || '',
        role: user.role || 'user',
        department: user.department || '',
        createdAt: new Date(user.created_at).toLocaleDateString(),
      })));
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const fetchApprovals = async () => {
    try {
      setLoading(true);
      
      // Get all approval requests
      const { data: approvalsData, error: approvalsError } = await supabase
        .from('approval_requests')
        .select('*')
        .order('request_date', { ascending: false });

      if (approvalsError) throw approvalsError;

      // Get all courses for names
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('id, name');

      if (coursesError) throw coursesError;

      // Get all user profiles for names
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name');

      if (profilesError) throw profilesError;

      // Create lookup tables
      const coursesMap = new Map(coursesData.map(course => [course.id, course.name]));
      const profilesMap = new Map(profilesData.map(profile => [profile.id, profile.name]));

      // Add course and requester names to approval requests
      const enhancedApprovals = approvalsData.map((approval: Tables<'approval_requests'>) => ({
        id: approval.id,
        course_id: approval.course_id,
        course_name: coursesMap.get(approval.course_id) || 'Unknown Course',
        request_date: new Date(approval.request_date).toLocaleString(),
        requested_by: approval.requested_by,
        requester_name: profilesMap.get(approval.requested_by) || 'Unknown User',
        approver_id: approval.approver_id,
        approval_type: approval.approval_type,
        item_id: approval.item_id,
        status: approval.status,
        comments: approval.comments,
        review_date: approval.review_date ? new Date(approval.review_date).toLocaleString() : null
      }));

      setApprovals(enhancedApprovals);
    } catch (error) {
      console.error('Error fetching approval requests:', error);
      toast.error('Failed to load approval requests');
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;
      
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      
      toast.success('User role updated successfully');
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

  const approveRequest = async (requestId: string, approved: boolean) => {
    try {
      const updateData = {
        status: approved ? 'Aprovado' : 'Rejeitado',
        approver_id: currentUser?.id,
        review_date: new Date().toISOString()
      };

      const { error } = await supabase
        .from('approval_requests')
        .update(updateData)
        .eq('id', requestId);

      if (error) throw error;

      // If approval is for a course status change, update the course
      const requestToUpdate = approvals.find(req => req.id === requestId);
      
      if (requestToUpdate && requestToUpdate.approval_type === 'course_status' && approved) {
        const { error: courseError } = await supabase
          .from('courses')
          .update({ status: 'Publicado' })
          .eq('id', requestToUpdate.course_id);
        
        if (courseError) throw courseError;
      }
      
      setApprovals(approvals.map(req => 
        req.id === requestId ? { ...req, status: updateData.status, review_date: updateData.review_date } : req
      ));
      
      toast.success(`Request ${approved ? 'approved' : 'rejected'} successfully`);
    } catch (error) {
      console.error('Error processing approval request:', error);
      toast.error('Failed to process approval request');
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Aprovado':
        return 'bg-green-100 text-green-800';
      case 'Rejeitado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'manager')) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Acesso Restrito</h1>
          <p>Você não tem permissão para acessar esta página.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Administração do Sistema</h1>
      
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex" aria-label="Tabs">
            <button
              onClick={() => setSelectedTab('users')}
              className={`w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                selectedTab === 'users'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Usuários
            </button>
            <button
              onClick={() => setSelectedTab('approvals')}
              className={`w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                selectedTab === 'approvals'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Aprovações
            </button>
          </nav>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : selectedTab === 'users' ? (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Departamento
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Função
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data de Cadastro
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.name || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.department || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={user.role}
                      onChange={(e) => updateUserRole(user.id, e.target.value)}
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                    >
                      <option value="user">Usuário</option>
                      <option value="instructor">Instrutor</option>
                      <option value="manager">Gerente</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.createdAt}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-primary hover:text-primary-focus">
                      Detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Curso
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Solicitante
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {approvals.map((request) => (
                <tr key={request.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{request.course_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{request.requester_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {request.approval_type === 'course_status' ? 'Publicação de Curso' : request.approval_type}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{request.request_date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(request.status)}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {request.status === 'Pendente' ? (
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => approveRequest(request.id, true)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Aprovar
                        </button>
                        <button 
                          onClick={() => approveRequest(request.id, false)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Rejeitar
                        </button>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">
                        {request.review_date ? `Revisado em ${request.review_date}` : ''}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {approvals.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    Nenhuma solicitação de aprovação encontrada
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Admin;
