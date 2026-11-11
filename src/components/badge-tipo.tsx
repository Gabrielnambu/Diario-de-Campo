import { TIPO_INFO, type TipoAmostra } from "@/lib/tipos";

export function BadgeTipo({ tipo }: { tipo: TipoAmostra }) {
  const info = TIPO_INFO[tipo];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium">
      <span className="size-2 rounded-full" style={{ backgroundColor: info.cor }} />
      {info.rotulo}
    </span>
  );
}
