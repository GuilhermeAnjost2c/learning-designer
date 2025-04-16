
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CourseForm } from "@/components/courses/CourseForm";

const CreateCourse = () => {
  const navigate = useNavigate();
  
  const handleClose = () => {
    navigate("/courses");
  };

  return <CourseForm onClose={handleClose} />;
};

export default CreateCourse;
