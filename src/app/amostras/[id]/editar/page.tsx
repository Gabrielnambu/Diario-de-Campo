import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AmostraForm } from "@/components/amostra-form";
import { exigirUsuario } from "@/lib/sessao";
import { buscarAmostra, dataISO } from "@/lib/amostras";
import { editarAmostra } from "../../actions";

export const metadata: Metadata = { title: "Editar amostra" };

export default async function EditarAmostra({ params }: PageProps<"/amostras/[id]/editar">) {
  const userId = await exigirUsuario();
  const { id } = await params;
  const amostra = await buscarAmostra(userId, id);
  if (!amostra) notFound();

  return (
    <div className="mx-auto grid max-w-3xl gap-6">
      <h1 className="text-2xl font-bold">Editar amostra</h1>
      <AmostraForm
        acao={editarAmostra.bind(null, amostra.id)}
        iniciais={{
          titulo: amostra.titulo,
          tipo: amostra.tipo,
          latitude: String(amostra.latitude),
          longitude: String(amostra.longitude),
          dataColeta: dataISO(amostra),
          observacoes: amostra.observacoes ?? "",
          fotoUrl: amostra.fotoUrl ?? "",
        }}
        cancelarHref={`/amostras/${amostra.id}`}
        uploadHabilitado={Boolean(process.env.UPLOADTHING_TOKEN)}
      />
    </div>
  );
}
