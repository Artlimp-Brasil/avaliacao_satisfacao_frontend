// src/stores/cupomStore.ts
import { create } from "zustand";


interface CupomState {
  cupom: string;
  setCupom: (cupom: string) => void;
  resetCupom: () => void; // <-- Adiciona isso
}

export const useCupomStore = create<CupomState>((set) => ({
  cupom: "",
  setCupom: (cupom) => set({ cupom }),
  resetCupom: () => set({ cupom: "" }), 
}));
