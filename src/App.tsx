import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TelaInicial from "./pages/TelaInicial";
import TelaSelecaoAtendimento from "./pages/TelaSelecaoAtendimento";
import TelaConfirmacao from "./pages/TelaConfirmacao";
import TelaAvaliacaoEstrela from "./pages/TelaAvaliacaoEstrelas"
import NotFound from "./pages/NotFound";
import TelaSatisfacaoCliente from "./pages/TelaSatisfacaoCliente"
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
        <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Sistema de Avaliação de Vendedoras */}
              <Route path="/" element={ <ProtectedRoute><TelaInicial /></ProtectedRoute>} />
              <Route path="/selecao-atendimento" element={<ProtectedRoute><TelaSelecaoAtendimento /></ProtectedRoute>} />
              <Route path="/confirmacao" element={<ProtectedRoute><TelaConfirmacao /></ProtectedRoute>} />
              <Route path="/avaliacao-estrela" element={<ProtectedRoute><TelaAvaliacaoEstrela /></ProtectedRoute>} />
              <Route path="/satisfacao-cliente" element={<ProtectedRoute><TelaSatisfacaoCliente /></ProtectedRoute>} />
              <Route path="/login" element={<Login />} />
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
          </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
