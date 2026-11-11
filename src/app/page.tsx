import Link from "next/link";
import { redirect } from "next/navigation";
import { Camera, Filter, MapPin } from "lucide-react";
import { auth } from "@/auth";
import { buttonVariants } from "@/components/ui/button";

export default async function Inicio() {
  const session = await auth();
  if (session?.user) redirect("/amostras");

  return (
    <section className="mx-auto grid max-w-2xl gap-8 py-12 text-center">
      <div className="grid gap-4">
        <h1 className="text-4xl font-bold tracking-tight">Diário de Campo</h1>
        <p className="text-lg text-muted-foreground">
          Registre amostras de rocha, solo, água e sedimento com local, data, foto e observações — e veja
          tudo no mapa.
        </p>
      </div>
      <div>
        <Link href="/login" className={buttonVariants({ size: "lg" })}>
          Entrar
        </Link>
      </div>
      <ul className="grid gap-4 text-left sm:grid-cols-3">
        <Recurso icone={<MapPin />} titulo="Local no mapa">
          Clique no mapa ou use o GPS para marcar o ponto de coleta.
        </Recurso>
        <Recurso icone={<Camera />} titulo="Foto">
          Anexe a foto da amostra ou do afloramento.
        </Recurso>
        <Recurso icone={<Filter />} titulo="Filtros">
          Encontre amostras por tipo, período ou título.
        </Recurso>
      </ul>
    </section>
  );
}

function Recurso({ icone, titulo, children }: { icone: React.ReactNode; titulo: string; children: React.ReactNode }) {
  return (
    <li className="grid gap-1 rounded-lg border p-4">
      <span className="flex items-center gap-2 font-medium [&_svg]:size-4">
        {icone} {titulo}
      </span>
      <span className="text-sm text-muted-foreground">{children}</span>
    </li>
  );
}
