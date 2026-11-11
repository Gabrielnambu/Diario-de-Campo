import { z } from "zod";

export const amostraSchema = z.object({
  titulo: z.string({ error: "Informe um título" }).trim().min(1, "Informe um título").max(120, "Máximo de 120 caracteres"),
  tipo: z.enum(["ROCHA", "SOLO", "AGUA", "SEDIMENTO"], { error: "Escolha um tipo" }),
  latitude: z.coerce
    .number({ error: "Latitude inválida" })
    .min(-90, "Latitude deve estar entre -90 e 90")
    .max(90, "Latitude deve estar entre -90 e 90"),
  longitude: z.coerce
    .number({ error: "Longitude inválida" })
    .min(-180, "Longitude deve estar entre -180 e 180")
    .max(180, "Longitude deve estar entre -180 e 180"),
  dataColeta: z.iso
    .date({ error: "Informe a data da coleta" })
    .refine((d) => d <= hojeISO(), "A data não pode estar no futuro"),
  observacoes: z.string().trim().max(5000, "Máximo de 5000 caracteres").optional(),
  fotoUrl: z.url({ protocol: /^https$/, error: "URL de foto inválida" }).optional(),
});

export type AmostraInput = z.infer<typeof amostraSchema>;

/** Converte FormData em objeto, tratando campos vazios como ausentes. */
export function formParaObjeto(formData: FormData) {
  const obj: Record<string, string> = {};
  for (const [chave, valor] of formData.entries()) {
    if (typeof valor === "string" && valor.trim() !== "") obj[chave] = valor;
  }
  return obj;
}

function hojeISO() {
  // Margem de um dia para fusos horários adiantados em relação ao servidor.
  const amanha = new Date(Date.now() + 24 * 60 * 60 * 1000);
  return amanha.toISOString().slice(0, 10);
}

export const filtrosSchema = z.object({
  tipo: z.enum(["ROCHA", "SOLO", "AGUA", "SEDIMENTO"]).optional().catch(undefined),
  de: z.iso.date().optional().catch(undefined),
  ate: z.iso.date().optional().catch(undefined),
  q: z.string().trim().max(100).optional().catch(undefined),
});

export type Filtros = z.infer<typeof filtrosSchema>;
