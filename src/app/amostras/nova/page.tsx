import type { Metadata } from "next";
import { AmostraForm } from "@/components/amostra-form";
import { exigirUsuario } from "@/lib/sessao";
import { criarAmostra } from "../actions";

export const metadata: Metadata = { title: "Nova amostra" };

export default async function NovaAmostra() {
  await exigirUsuario();

  return (
    <div className="mx-auto grid max-w-3xl gap-6">
      <h1 className="text-2xl font-bold">Nova amostra</h1>
      <AmostraForm
        acao={criarAmostra}
        iniciais={{ dataColeta: new Date().toISOString().slice(0, 10) }}
        cancelarHref="/amostras"
        uploadHabilitado={Boolean(process.env.UPLOADTHING_TOKEN)}
      />
    </div>
  );
}
