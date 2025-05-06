
import { CourseForm } from "@/components/courses/CourseForm";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/userStore";
import { useEffect } from "react";

const CreateCourse = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useUserStore();
  
  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);
  
  const handleClose = () => {
    navigate("/courses");
  };

  if (!currentUser) {
    return (
      <div className="container max-w-4xl mx-auto py-8 text-center">
        <p className="text-lg">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border">
        <CourseForm onClose={handleClose} />
      </div>
    </div>
  );
};

export default CreateCourse;
