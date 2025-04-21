
import { CourseForm } from "@/components/courses/CourseForm";
import { useNavigate } from "react-router-dom";

const CreateCourse = () => {
  const navigate = useNavigate();
  
  const handleClose = () => {
    navigate("/courses");
  };

  return (
    <div className="container max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border">
        <CourseForm onClose={handleClose} />
      </div>
    </div>
  );
};

export default CreateCourse;
