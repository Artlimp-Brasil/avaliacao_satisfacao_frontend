
export interface Vendedora {
  cupom: string;
  ven_cod: string;
  apelido: string;
  imagemBase64: string | null;
  tipoAtendimento?: number; // opcional, será setado depois
}
