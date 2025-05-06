
import { CourseForm } from "@/components/courses/CourseForm";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/userStore";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const CreateCourse = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useUserStore();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check authentication status
    console.log("CreateCourse - Auth status:", { isAuthenticated, currentUser });
    
    // Redirecionar para login se não estiver autenticado
    if (!isAuthenticated) {
      toast.error("Você precisa estar logado para criar cursos");
      navigate("/login");
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, navigate, currentUser]);
  
  const handleClose = () => {
    console.log("Closing course form, navigating to courses page");
    navigate("/courses");
  };

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto py-8 text-center">
        <p className="text-lg">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <div className="bg-white rounded-lg shadow-sm border">
        <CourseForm onClose={handleClose} />
      </div>
    </div>
  );
};

export default CreateCourse;
