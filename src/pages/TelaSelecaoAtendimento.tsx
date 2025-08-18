import { useNavigate } from "react-router-dom";
import { EvaluationButton } from "@/components/ui/evaluation-button";
import { X, HelpCircle, CheckCircle } from "lucide-react";
import { useAtendimentoStore } from "@/stores/atendimentoStore";
import backgroundImage from "@/assets/backgroundImagem.jpg";
import { useState } from "react";

const TelaSelecaoAtendimento = () => {
  const navigate = useNavigate();
  const { vendedoras, indiceAtual, salvarAtendimento, setTipoAtendimento } = useAtendimentoStore();
  const vendedoraAtual = vendedoras[indiceAtual];
  const [isLoading, setIsLoading] = useState(false);

  if (!vendedoraAtual) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <p>Carregando dados da vendedora...</p>
      </div>
    );
  }

  console.log(vendedoraAtual)
  
  const handleSelecaoAtendimento = async (tipoAtendimento: number) => {
    const atendimento = {
      codigoVendedora: vendedoraAtual.ven_cod,
      cupom: vendedoraAtual.cupom,
      ven_nome: vendedoraAtual.apelido.trim(),
      tipoAtendimento,
      avaliacao: 0,
    };

    if (tipoAtendimento === 0) {
      try {
        setIsLoading(true); // Mostra spinner
        const terminouFila = await salvarAtendimento(atendimento, true);
        
        setTimeout(() => {
          setIsLoading(false);
          if (!terminouFila) return;
          navigate("/confirmacao");
        }, 500);
      } catch (error) {
        setIsLoading(false);
        alert("Erro ao salvar atendimento. Tente novamente.");
      }
    } else {
      try {
        setTipoAtendimento(indiceAtual, tipoAtendimento);
        navigate("/avaliacao-estrela");
      } catch (error) {
        alert("Erro ao selecionar atendimento. Tente novamente.");
      }
    }
  };

  return (
<div
  className="relative min-h-screen w-full bg-cover bg-center bg-no-repeat"
  style={{ backgroundImage: `url(${backgroundImage})` }}
>
  {isLoading ? (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {/* Spinner */}
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-lg font-medium text-primary">Carregando próxima vendedora...</p>
    </div>
  ) : (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      {/* Balão com foto e nome */}
      <div className="relative bg-white rounded-3xl p-6 w-full max-w-2xl text-center shadow-lg">
        <h1 className="text-lg md:text-xl font-medium text-foreground mb-4">
          Avalie a vendedora!
        </h1>
        <div className="flex flex-col items-center">
          <div className="w-28 h-28 rounded-full border-4 border-primary overflow-hidden shadow-md">
            <img
              src={
                vendedoraAtual.imagemBase64 ||
                "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
              }
              alt={vendedoraAtual.apelido}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src =
                  "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png";
              }}
            />
          </div>
          <div className="mt-4">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              {vendedoraAtual.apelido.trim()}
            </h2>
          </div>
        </div>
        <div className="absolute left-1/2 -bottom-4 transform -translate-x-1/2 w-8 h-8 rotate-45 bg-white" />
      </div>

      {/* Pergunta */}
      <div className="mt-10 w-full flex justify-center">
        <h3 className="bg-primary text-white w-3/6 text-center px-6 py-2 rounded-lg text-lg md:text-xl font-medium">
          Como foi seu atendimento?
        </h3>
      </div>

      {/* Botões */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl px-4">
        <EvaluationButton
          title="Sem Atendimento"
          icon={<X />}
          iconSize="w-28 h-28"
          onClick={() => handleSelecaoAtendimento(0)}
          className="hover:border-destructive/30 hover:bg-destructive/5"
        />
        <EvaluationButton
          title="Auxílio"
          icon={<HelpCircle />}
          iconSize="w-28 h-28"
          onClick={() => handleSelecaoAtendimento(1)}
          className="hover:border-primary/30 hover:bg-primary/5"
        />
        <EvaluationButton
          title="Atendimento Completo"
          icon={<CheckCircle />}
          iconSize="w-28 h-28"
          onClick={() => handleSelecaoAtendimento(2)}
          className="hover:border-accent/30 hover:bg-accent/5"
        />
      </div>
    </div>
  )}
</div>

  );
};

export default TelaSelecaoAtendimento;
