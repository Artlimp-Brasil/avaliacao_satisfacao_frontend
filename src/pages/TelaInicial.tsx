import { useNavigate } from "react-router-dom";
import backgroundImage from "@/assets/PF_AVALIAÇÃO_VENDEDORAS_AGO_25-01.jpg";
import { useCupomStore } from "@/stores/cupomStore";
import { useAtendimentoStore } from "@/stores/atendimentoStore";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const TelaInicial = () => {
  const token = localStorage.getItem("token");
  const pdv = localStorage.getItem("pdv");
  const cupom = useCupomStore();
  const atendimento = useAtendimentoStore();
  const navigate = useNavigate();
  const setCupom = useCupomStore((state) => state.setCupom);

  const [modalAberto, setModalAberto] = useState(false);
  const [mensagemModal, setMensagemModal] = useState("");

  useEffect(() => {
    console.log("Cupom atual:", cupom.cupom);
    console.log("Atendimento atual:", atendimento);
  }, [cupom, atendimento]);

  const abrirModal = (mensagem: string) => {
    setMensagemModal(mensagem);
    setModalAberto(true);

    // Fecha automaticamente após 3 segundos
    setTimeout(() => {
      setModalAberto(false);
    }, 3000);
  };

  const handleClick = async () => {
    try {
      const response = await fetch("http://localhost:3000/cupons/buscar", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          pdv: pdv ?? "",
        },
      });

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
        window.location.href = "/login"; 
        return 
      } 

      if (!response.ok) throw new Error("Erro ao buscar vendas");

      const data = await response.json();
      const pesquisa = data.pesquisa;

      if (pesquisa.length > 0) {
        setCupom(pesquisa[0].Cupom);
        console.log("🔍 Cupom definido na TelaInicial:", pesquisa[0].Cupom);
        navigate("/satisfacao-cliente");
      } else {
        abrirModal("Nenhuma venda encontrada.");
      }
    } catch (error) {
      console.error("❌ Erro ao buscar dados:", error);
      abrirModal("Erro ao buscar dados da pesquisa. Tente novamente.");
    }
  };

  return (
    <>
      <div
        className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center cursor-pointer"
        style={{ backgroundImage: `url(${backgroundImage})` }}
        onClick={handleClick}
      />

      {/* Modal de alerta */}
      <Dialog open={modalAberto} onOpenChange={setModalAberto}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader>
            <DialogTitle>Atenção</DialogTitle>
            <DialogDescription>{mensagemModal}</DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex justify-center">
            <Button onClick={() => setModalAberto(false)} className="px-6">
              Fechar agora
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TelaInicial;
