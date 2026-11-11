"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { exigirUsuario } from "@/lib/sessao";
import { z } from "zod";
import { amostraSchema, formParaObjeto } from "@/lib/validacao";

export type EstadoForm = {
  erros?: Partial<Record<string, string[]>>;
  mensagem?: string;
  valores?: Record<string, string>;
};

function validar(formData: FormData) {
  const valores = formParaObjeto(formData);
  const resultado = amostraSchema.safeParse(valores);
  return { valores, resultado };
}

export async function criarAmostra(_: EstadoForm, formData: FormData): Promise<EstadoForm> {
  const userId = await exigirUsuario();
  const { valores, resultado } = validar(formData);
  if (!resultado.success) {
    return { erros: z.flattenError(resultado.error).fieldErrors, valores };
  }

  const { dataColeta, ...dados } = resultado.data;
  const amostra = await prisma.amostra.create({
    data: { ...dados, dataColeta: new Date(dataColeta), userId },
  });

  revalidatePath("/amostras");
  redirect(`/amostras/${amostra.id}`);
}

export async function editarAmostra(
  id: string,
  _: EstadoForm,
  formData: FormData,
): Promise<EstadoForm> {
  const userId = await exigirUsuario();
  const { valores, resultado } = validar(formData);
  if (!resultado.success) {
    return { erros: z.flattenError(resultado.error).fieldErrors, valores };
  }

  const { dataColeta, ...dados } = resultado.data;
  // updateMany com userId no filtro: impede editar amostra de outro usuário.
  const { count } = await prisma.amostra.updateMany({
    where: { id, userId },
    data: {
      ...dados,
      observacoes: dados.observacoes ?? null,
      fotoUrl: dados.fotoUrl ?? null,
      dataColeta: new Date(dataColeta),
    },
  });
  if (count === 0) return { mensagem: "Amostra não encontrada.", valores };

  revalidatePath("/amostras");
  revalidatePath(`/amostras/${id}`);
  redirect(`/amostras/${id}`);
}

export async function excluirAmostra(id: string) {
  const userId = await exigirUsuario();
  await prisma.amostra.deleteMany({ where: { id, userId } });
  revalidatePath("/amostras");
  redirect("/amostras");
}
