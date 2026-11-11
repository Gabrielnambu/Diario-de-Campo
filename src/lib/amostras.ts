import "server-only";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import type { Filtros } from "@/lib/validacao";
import type { PontoMapa } from "@/lib/pontos";

/** Lista as amostras de um usuário aplicando os filtros da URL. */
export function listarAmostras(userId: string, filtros: Filtros) {
  const where: Prisma.AmostraWhereInput = { userId };

  if (filtros.tipo) where.tipo = filtros.tipo;
  if (filtros.de || filtros.ate) {
    where.dataColeta = {
      ...(filtros.de && { gte: new Date(filtros.de) }),
      ...(filtros.ate && { lte: new Date(filtros.ate) }),
    };
  }
  if (filtros.q) where.titulo = { contains: filtros.q, mode: "insensitive" };

  return prisma.amostra.findMany({
    where,
    orderBy: [{ dataColeta: "desc" }, { criadoEm: "desc" }],
  });
}

/** Busca uma amostra garantindo que pertence ao usuário. */
export function buscarAmostra(userId: string, id: string) {
  return prisma.amostra.findFirst({ where: { id, userId } });
}

export type Amostra = NonNullable<Awaited<ReturnType<typeof buscarAmostra>>>;

/** Data da coleta como AAAA-MM-DD (coluna @db.Date chega como meia-noite UTC). */
export function dataISO(a: Pick<Amostra, "dataColeta">) {
  return a.dataColeta.toISOString().slice(0, 10);
}

/** Data da coleta como DD/MM/AAAA. */
export function dataBR(a: Pick<Amostra, "dataColeta">) {
  return dataISO(a).split("-").reverse().join("/");
}

export function paraPonto(a: Amostra): PontoMapa {
  return {
    id: a.id,
    titulo: a.titulo,
    tipo: a.tipo,
    latitude: a.latitude,
    longitude: a.longitude,
    dataColeta: dataISO(a),
  };
}
