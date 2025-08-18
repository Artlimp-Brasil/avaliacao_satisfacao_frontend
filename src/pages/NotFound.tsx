import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-soft flex items-center justify-center px-4">
      <div className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-light text-foreground">404</h1>
        <p className="text-xl text-muted-foreground">Página não encontrada</p>
        <a 
          href="/" 
          className="inline-block text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
        >
          Voltar ao início
        </a>
      </div>
    </div>
  );
};

export default NotFound;
