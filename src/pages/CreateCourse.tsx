
import { CourseForm } from "@/components/courses/CourseForm";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const CreateCourse = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const handleClose = () => {
    navigate("/courses");
  };

  if (!user) {
    return null; // or a loading indicator
  }

  return (
    <div className="container max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border">
        <CourseForm onClose={handleClose} userId={user.id} />
      </div>
    </div>
  );
};

export default CreateCourse;
