import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useCupomStore } from "@/stores/cupomStore";
import { useAtendimentoStore } from "@/stores/atendimentoStore";
import backgroundImage from "@/assets/PF_AVALIAÇÃO_VENDEDORAS_AGO_25_2-05.jpg";

const opcoes = [
  { valor: 1, label: "Ruim" },
  { valor: 2, label: "Regular" },
  { valor: 3, label: "Bom" },
  { valor: 4, label: "Ótimo" },
];

const TelaSatisfacaoCliente = () => {


  const token = localStorage.getItem("token");
  const pdv = localStorage.getItem("pdv");

  const navigate = useNavigate();
  const [satisfacao, setSatisfacao] = useState<number | null>(null);

  const cupom = useCupomStore((state) => state.cupom);
  const setVendedoras = useAtendimentoStore((state) => state.setVendedoras);
  const setIndiceAtual = useAtendimentoStore((state) => state.setIndiceAtual);

  // ✅ Quando satisfacao mudar, enviamos ao backend
  useEffect(() => {
    const enviarSatisfacao = async () => {

      if (satisfacao === null) return; // só dispara se tiver valor válido

      try {
        const response = await fetch("http://localhost:3000/satisfacao/salvar", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            pdv: pdv || "",
          },
          body: JSON.stringify({ cupom, satisfacao }),
        });
        
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("token");
          window.location.href = "/login"; 
          return 
        } 

        const data = await response.json();
        console.log("📦 Dados recebidos do backend:", data);

        if (!data.success) {
          alert("Erro ao registrar satisfação");
          return;
        }

        setVendedoras(data.vendedoras);
        setIndiceAtual(0);
        navigate(data.proximaRota);
      } catch (error) {
        console.error("Erro ao enviar satisfação:", error);
        alert("Erro ao registrar satisfação. Tente novamente.");
      }
    };

    enviarSatisfacao();
  }, [satisfacao]); // ← dispara sempre que satisfacao muda

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute top-[53%] left-1/2 transform -translate-x-1/2 w-full max-w-xl px-4">
        <Card className="p-8 bg-transparent !shadow-none border-none rounded-2xl text-center space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {opcoes.map(({ valor, label }) => (
              <button
                key={valor}
                onClick={() => setSatisfacao(valor)} // apenas seta o estado
                className={`p-6 rounded-lg border font-semibold text-2xl transition ${satisfacao === valor
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-black border-gray-300 hover:bg-gray-100"
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TelaSatisfacaoCliente;
