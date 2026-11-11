import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CampoSelect } from "@/components/campo-select";
import { TIPOS } from "@/lib/tipos";
import type { Filtros } from "@/lib/validacao";

/** Formulário GET: os filtros ficam na URL (compartilháveis e funcionam sem JS). */
export function FiltrosAmostras({ filtros, visao }: { filtros: Filtros; visao: string }) {
  return (
    <form className="grid gap-3 rounded-lg border p-4 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_auto] lg:items-end">
      <input type="hidden" name="visao" value={visao} />
      <div className="grid gap-1.5">
        <Label htmlFor="q">Buscar</Label>
        <Input id="q" name="q" defaultValue={filtros.q} placeholder="Título…" />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="tipo">Tipo</Label>
        <CampoSelect id="tipo" name="tipo" defaultValue={filtros.tipo ?? ""}>
          <option value="">Todos</option>
          {TIPOS.map((t) => (
            <option key={t.valor} value={t.valor}>
              {t.rotulo}
            </option>
          ))}
        </CampoSelect>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="de">De</Label>
        <Input id="de" name="de" type="date" defaultValue={filtros.de} />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="ate">Até</Label>
        <Input id="ate" name="ate" type="date" defaultValue={filtros.ate} />
      </div>
      <div className="flex gap-2">
        <Button type="submit">Filtrar</Button>
        <Link href={`/amostras?visao=${visao}`} className={buttonVariants({ variant: "ghost" })}>
          Limpar
        </Link>
      </div>
    </form>
  );
}
