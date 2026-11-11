import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ImageOff, List, Map as MapIcon, Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BadgeTipo } from "@/components/badge-tipo";
import { FiltrosAmostras } from "@/components/filtros-amostras";
import { Mapa } from "@/components/mapa";
import { exigirUsuario } from "@/lib/sessao";
import { dataBR, listarAmostras, paraPonto } from "@/lib/amostras";
import { filtrosSchema } from "@/lib/validacao";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Amostras" };

export default async function Amostras({ searchParams }: PageProps<"/amostras">) {
  const userId = await exigirUsuario();
  const params = await searchParams;
  const filtros = filtrosSchema.parse(params);
  const visao = params.visao === "mapa" ? "mapa" : "lista";
  const amostras = await listarAmostras(userId, filtros);
  const filtrando = Boolean(filtros.q || filtros.tipo || filtros.de || filtros.ate);

  // Mantém os filtros ao alternar entre lista e mapa.
  const linkVisao = (v: string) => {
    const qs = new URLSearchParams();
    for (const [k, val] of Object.entries(filtros)) if (val) qs.set(k, val);
    qs.set("visao", v);
    return `/amostras?${qs}`;
  };

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Minhas amostras</h1>
          <p className="text-sm text-muted-foreground">
            {amostras.length} {amostras.length === 1 ? "amostra" : "amostras"}
            {filtrando && " encontradas com os filtros atuais"}
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex rounded-lg border p-0.5">
            <Link
              href={linkVisao("lista")}
              className={cn(buttonVariants({ variant: visao === "lista" ? "secondary" : "ghost", size: "sm" }))}
            >
              <List /> Lista
            </Link>
            <Link
              href={linkVisao("mapa")}
              className={cn(buttonVariants({ variant: visao === "mapa" ? "secondary" : "ghost", size: "sm" }))}
            >
              <MapIcon /> Mapa
            </Link>
          </div>
          <Link href="/amostras/nova" className={buttonVariants()}>
            <Plus /> Nova amostra
          </Link>
        </div>
      </div>

      <FiltrosAmostras filtros={filtros} visao={visao} />

      {amostras.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
          {filtrando ? (
            "Nenhuma amostra encontrada com esses filtros."
          ) : (
            <>
              Nenhuma amostra ainda.{" "}
              <Link href="/amostras/nova" className="font-medium text-foreground underline">
                Cadastre a primeira
              </Link>
              .
            </>
          )}
        </div>
      ) : visao === "mapa" ? (
        <Mapa pontos={amostras.map(paraPonto)} altura="560px" />
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Foto</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="hidden md:table-cell">Coordenadas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {amostras.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>
                    {a.fotoUrl ? (
                      <Image src={a.fotoUrl} alt="" width={40} height={40} className="size-10 rounded object-cover" />
                    ) : (
                      <span className="flex size-10 items-center justify-center rounded bg-muted text-muted-foreground">
                        <ImageOff className="size-4" />
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    <Link href={`/amostras/${a.id}`} className="hover:underline">
                      {a.titulo}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <BadgeTipo tipo={a.tipo} />
                  </TableCell>
                  <TableCell>{dataBR(a)}</TableCell>
                  <TableCell className="hidden font-mono text-xs text-muted-foreground md:table-cell">
                    {a.latitude.toFixed(5)}, {a.longitude.toFixed(5)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
