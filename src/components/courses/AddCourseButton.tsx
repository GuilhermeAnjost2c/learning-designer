
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export const AddCourseButton = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="fixed bottom-8 right-8 z-10"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20,
        delay: 0.3 
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button 
        onClick={() => navigate("/courses/new")} 
        size="lg" 
        className="rounded-full h-14 w-14 shadow-lg"
      >
        <PlusCircle className="h-6 w-6" />
        <span className="sr-only">Adicionar Curso</span>
      </Button>
    </motion.div>
  );
};
