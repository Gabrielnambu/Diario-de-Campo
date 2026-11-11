import type { TipoAmostra } from "@/generated/prisma/enums";

export const TIPOS: { valor: TipoAmostra; rotulo: string; cor: string }[] = [
  { valor: "ROCHA", rotulo: "Rocha", cor: "#8b5e3c" },
  { valor: "SOLO", rotulo: "Solo", cor: "#c2852f" },
  { valor: "AGUA", rotulo: "Água", cor: "#2b7bb9" },
  { valor: "SEDIMENTO", rotulo: "Sedimento", cor: "#6b8e23" },
];

export const TIPO_INFO = Object.fromEntries(TIPOS.map((t) => [t.valor, t])) as Record<
  TipoAmostra,
  (typeof TIPOS)[number]
>;

export type { TipoAmostra };
