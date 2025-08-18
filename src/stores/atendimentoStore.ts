import { create } from "zustand";
import { Vendedora } from '@/types/vendedora'
import { Atendimento } from "@/types/atendimentoType";


interface AtendimentoState {
  vendedoras: Vendedora[];
  indiceAtual: number;
  setVendedoras: (vendedoras: Vendedora[]) => void;
  setIndiceAtual: (indice: number) => void;
  setTipoAtendimento: (indice: number, tipo: number) => void;
  salvarAtendimento: ( atendimento: Atendimento, avancarIndice: boolean ) => Promise<boolean>;
  reset: () => void;
}

export const useAtendimentoStore = create<AtendimentoState>((set, get) => ({
  vendedoras: [],
  indiceAtual: 0,

  setVendedoras: (vendedoras) => set({ vendedoras }),
  setIndiceAtual: (indice) => set({ indiceAtual: indice }),

  setTipoAtendimento: (indice, tipo) =>
    set((state) => {
      const novaVendedoras = [...state.vendedoras];
      novaVendedoras[indice] = {
        ...novaVendedoras[indice],
        tipoAtendimento: tipo,
      };
      return { vendedoras: novaVendedoras };
    }),

  salvarAtendimento: async (atendimento, avancarIndice) => {

    const token = localStorage.getItem("token");
    const pdv = localStorage.getItem("pdv")
    
    try {
      const response = await fetch("http://localhost:3000/salvar-avaliacao", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "pdv": pdv ? pdv : ""
        },
        body: JSON.stringify(atendimento),
      });

      if (!response.ok) throw new Error("Erro ao salvar atendimento");
      
      
   
      
      if (avancarIndice) {
        const novoIndice = get().indiceAtual + 1;
        const total = get().vendedoras.length;

        if (novoIndice < total) {
          set({ indiceAtual: novoIndice });
          return false; // Ainda tem vendedoras na fila
        } else {
          return true; // Acabou a fila
        }
      }

      return false; // Não avançou índice, não acabou fila
    } catch (error) {
      console.error("Erro no salvarAtendimento:", error);
      throw error;
    }
  },
  reset: () =>
    set({
      vendedoras: [],
      indiceAtual: 0,
    }),
}));
