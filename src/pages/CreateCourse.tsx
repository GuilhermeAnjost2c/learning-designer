
import { CourseForm } from "@/components/courses/CourseForm";
import { useNavigate } from "react-router-dom";

const CreateCourse = () => {
  const navigate = useNavigate();
  
  const handleClose = () => {
    navigate("/courses");
  };

  return (
    <div className="container mx-auto py-6">
      <CourseForm onClose={handleClose} />
    </div>
  );
};

export default CreateCourse;
