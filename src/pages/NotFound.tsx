import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FolderX, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center p-8 max-w-md"
      >
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-primary/10 rounded-full">
            <FolderX className="h-16 w-16 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4">Página não encontrada</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Desculpe, não conseguimos encontrar a página que você está procurando.
        </p>
        <Button asChild size="lg" className="gap-2">
          <Link to="/">
            <Home className="h-5 w-5" />
            <span>Voltar ao Dashboard</span>
          </Link>
        </Button>
      </motion.div>
    </div>
  );
};

export default NotFound;
