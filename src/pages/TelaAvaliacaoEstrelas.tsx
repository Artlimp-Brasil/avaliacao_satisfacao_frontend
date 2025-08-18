import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { useAtendimentoStore } from "@/stores/atendimentoStore";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import backgroundImage from "@/assets/backgroundImagem.jpg";

const TelaAvaliacaoEstrelaTESTE = () => {
  const navigate = useNavigate();

  const {
    vendedoras,
    indiceAtual,
    salvarAtendimento,
    setIndiceAtual,
  } = useAtendimentoStore();

  const vendedoraAtual = vendedoras[indiceAtual];

  // Nota de avaliação, 1 a 5
  const [avaliacao, setAvaliacao] = useState<number | null>(null);
  const [hoveredStar, setHoveredStar] = useState<number>(0);

  if (!vendedoraAtual) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <p>Carregando dados da vendedora...</p>
      </div>
    );
  }

  // Tipo de atendimento salvo anteriormente na tela seleção
  const tipoAtendimento = vendedoraAtual.tipoAtendimento; // default 1 para evitar erros

  const tipoTexto =
    tipoAtendimento === 0
      ? "Sem atendimento"
      : tipoAtendimento === 1
        ? "auxílio dado pela Vendedora"
        : "atendimento dado pela Vendedora";





  const handleConfirmarAvaliacao = async () => {
    if (!avaliacao) {
      alert("Por favor, selecione uma avaliação entre 1 e 5 estrelas.");
      return;
    }

    const atendimento = {
      codigoVendedora: vendedoraAtual.ven_cod,
      cupom: vendedoraAtual.cupom,
      ven_nome: vendedoraAtual.apelido.trim(),
      tipoAtendimento,
      avaliacao,
    };

    try {
      const terminouFila = await salvarAtendimento(atendimento, true);

      if (!terminouFila) {
        setIndiceAtual(indiceAtual + 1);
        navigate("/selecao-atendimento");
      } else {
        navigate("/confirmacao");
      }
    } catch (error) {
      alert("Erro ao salvar avaliação. Tente novamente.");
    }
  };
  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starNumber = index + 1;
      const isActive = starNumber <= (hoveredStar || avaliacao);

      return (
        <button
          key={starNumber}
          onClick={() => setAvaliacao(starNumber)}
          onMouseEnter={() => setHoveredStar(starNumber)}
          onMouseLeave={() => setHoveredStar(0)}
          className="p-2 transition-transform duration-200 hover:scale-110"
        >
          <Star
            className={`w-12 h-12 transition-colors duration-200 ${isActive
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground hover:text-yellow-400"
              }`}
          />
        </button>
      );
    });
  };
  return (
    <div
      className="relative min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">


        {/* Balão com foto e nome */}
        <div className="relative bg-white rounded-3xl p-6  w-full max-w-2xl text-center shadow-lg">
          {/* Foto */} 
          <h1 className="text-lg md:text-xl font-medium text-foreground mb-4">
            Avalie o {tipoTexto}!
          </h1>
          <div className="flex flex-col items-center ">
            <div className="w-28 h-28 rounded-full border-4 border-primary overflow-hidden shadow-md">
              <img
                src={
                  vendedoraAtual.imagemBase64 ||
                  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face"
                }
                alt={vendedoraAtual.apelido}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face";
                }}
              />
            </div>

            {/* Nome e cargo */}
            <div className="mt-4">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                {vendedoraAtual.apelido.trim()}
              </h2>
            </div>
          </div>

          {/* Setinha */}
          <div className="absolute left-1/2 -bottom-4 transform -translate-x-1/2 w-8 h-8 rotate-45 bg-white" />
        </div>

        {/* Pergunta */}
        <div className="mt-10 w-full flex justify-center">
          <h3 className="bg-primary text-white w-4/6 text-center px-6 py-2 rounded-lg text-lg md:text-xl font-medium">
            Como você avalia o {tipoTexto}?
          </h3>
        </div>


        {/* Estrelas */}
        <div className="mt-6 flex justify-center space-x-4">
          {renderStars()}
        </div>

        {/* Botão de confirmar */}
        <div className="mt-4 flex flex-col items-center">
          <Button
            onClick={handleConfirmarAvaliacao}
            disabled={!avaliacao}
            size="lg"
            className="px-8 py-4 text-lg bg-white text-black hover:bg-gray-300 disabled:opacity-50"
          >
            CONFIRMAR AVALIAÇÃO
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            Selecione de 1 a 5 estrelas para continuar
          </p>
        </div>
      </div>
    </div>
  );
};
export default TelaAvaliacaoEstrelaTESTE;
