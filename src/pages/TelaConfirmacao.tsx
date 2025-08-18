import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import { CheckCircle, QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useAtendimentoStore } from "../stores/atendimentoStore"; // ajuste o caminho se necessário
import { useCupomStore } from "../stores/cupomStore"
import backgroundImage from "@/assets/backgroundImagem.jpg"

const TelaConfirmacao = () => {
  const [contador, setContador] = useState(10);
  const [modalAberto, setModalAberto] = useState(false);
  const navigate = useNavigate();
  const cupom = useCupomStore((state) => state.cupom);
  const resetState = useAtendimentoStore((state) => state.reset);
  const resetCupom = useCupomStore((state) => state.resetCupom);


  useEffect(() => {
    const token = localStorage.getItem("token");
    const pdv = localStorage.getItem("pdv")

    if (cupom) {
      fetch("http://localhost:3000/cupons/tratar-cupom", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "pdv": pdv ? pdv : '',
        },
        body: JSON.stringify({ cupom }),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Erro ao marcar cupom como tratado");
          }
          if (res.status === 401 || res.status === 403) {
            localStorage.removeItem("token");
            window.location.href = "/login"; 
            return 
          } 
          return res.json();
        })
        .then((data) => {
          if (data.success) {
            console.log("✅ Cupom tratado com sucesso.");
            resetState();
            resetCupom()
            // limpa Zustand após sucesso
          } else {
            console.warn("⚠️ Cupom não foi tratado:", data.error);
          }
        })
        .catch((err) => {
          console.error("❌ Erro ao tratar cupom:", err);
        });
    }

    const timer = setTimeout(() => {
      navigate("/");
    }, modalAberto ? 60000 : 10000);

    const contadorInterval = setInterval(() => {
      setContador((prev) => {
        if (prev <= 1) {
          clearInterval(contadorInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(contadorInterval);
    };
  }, [navigate, modalAberto, cupom, resetState, resetCupom]);

  return (

    <div
      className="relative min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
        <div className="relative bg-white rounded-3xl p-6  w-full max-w-2xl text-center shadow-lg">
          {/* Setinha */}
          <div className="absolute left-1/2 -bottom-4 transform -translate-x-1/2 w-8 h-8 rotate-45 bg-white" />
          <div className="text-center space-y-4 mt-2 mb-2">
            {/* Ícone de confirmação */}
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-accent" />
              </div>
            </div>
            {/* Mensagem de agradecimento */}
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-light text-foreground">
                Obrigado!
              </h1>
              <p className="text-xl md:text-2xl text-primary font-medium ">
                Sua avaliação é muito importante para nós.
              </p>
            </div>
          </div>
        </div>

        {/* Botões de ação */}
        <div className="space-y-6 mt-10">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Dialog onOpenChange={setModalAberto}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-6 text-lg shadow-soft"
                >
                  <QrCode className="w-5 h-5 mr-2" />
                  Pegue seu cupom de desconto
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-center">
                    Conheça o Palácio das Festas
                  </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center space-y-4 p-6">
                  <QRCodeSVG
                    value="https://www.palaciodasfestas.com.br/"
                    size={200}
                    level="M"
                    includeMargin={true}
                  />
                  <p className="text-sm text-muted-foreground text-center">
                    Visite o site www.palaciodasfestas.com.br e use o cupom
                    CLIENTE-NOVO-10
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        {/* Contador regressivo */}
        <div className="text-sm text-muted-foreground mt-2">
          Retornando à tela inicial em {contador} segundos
        </div>
      </div>
    </div>
  );
};

export default TelaConfirmacao;
