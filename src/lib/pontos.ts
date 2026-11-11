import type { TipoAmostra } from "@/lib/tipos";

/** Formato serializável de uma amostra, enviado ao mapa (componente cliente). */
export type PontoMapa = {
  id: string;
  titulo: string;
  tipo: TipoAmostra;
  latitude: number;
  longitude: number;
  dataColeta: string; // AAAA-MM-DD
};
