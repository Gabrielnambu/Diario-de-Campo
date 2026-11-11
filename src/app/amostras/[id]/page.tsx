import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { BadgeTipo } from "@/components/badge-tipo";
import { BotaoExcluir } from "@/components/botao-excluir";
import { Mapa } from "@/components/mapa";
import { exigirUsuario } from "@/lib/sessao";
import { buscarAmostra, dataBR, paraPonto } from "@/lib/amostras";

export async function generateMetadata({ params }: PageProps<"/amostras/[id]">): Promise<Metadata> {
  const userId = await exigirUsuario();
  const amostra = await buscarAmostra(userId, (await params).id);
  return { title: amostra?.titulo ?? "Amostra" };
}

export default async function DetalheAmostra({ params }: PageProps<"/amostras/[id]">) {
  const userId = await exigirUsuario();
  const { id } = await params;
  const amostra = await buscarAmostra(userId, id);
  if (!amostra) notFound();

  return (
    <div className="grid gap-6">
      <Link href="/amostras" className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Voltar para amostras
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="grid gap-2">
          <h1 className="text-2xl font-bold">{amostra.titulo}</h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <BadgeTipo tipo={amostra.tipo} />
            <span>Coletada em {dataBR(amostra)}</span>
            <span className="font-mono">
              {amostra.latitude.toFixed(6)}, {amostra.longitude.toFixed(6)}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/amostras/${amostra.id}/editar`} className={buttonVariants({ variant: "outline" })}>
            <Pencil /> Editar
          </Link>
          <BotaoExcluir id={amostra.id} titulo={amostra.titulo} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="grid content-start gap-6">
          {amostra.fotoUrl && (
            <a href={amostra.fotoUrl} target="_blank" rel="noreferrer">
              <Image
                src={amostra.fotoUrl}
                alt={`Foto de ${amostra.titulo}`}
                width={800}
                height={600}
                className="max-h-[420px] w-full rounded-lg border object-cover"
              />
            </a>
          )}
          <section className="grid gap-2">
            <h2 className="font-semibold">Observações</h2>
            {amostra.observacoes ? (
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{amostra.observacoes}</p>
            ) : (
              <p className="text-sm text-muted-foreground">Sem observações.</p>
            )}
          </section>
        </div>
        <Mapa pontos={[paraPonto(amostra)]} altura="420px" />
      </div>

      <p className="text-xs text-muted-foreground">
        Registrada em {amostra.criadoEm.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}
      </p>
    </div>
  );
}
