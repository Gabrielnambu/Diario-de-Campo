"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LocateFixed, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CampoSelect } from "@/components/campo-select";
import { Mapa } from "@/components/mapa";
import { UploadButton } from "@/lib/uploadthing";
import { TIPOS } from "@/lib/tipos";
import { cn } from "@/lib/utils";
import type { EstadoForm } from "@/app/amostras/actions";

export type ValoresAmostra = {
  titulo?: string;
  tipo?: string;
  latitude?: string;
  longitude?: string;
  dataColeta?: string;
  observacoes?: string;
  fotoUrl?: string;
};

type Props = {
  acao: (estado: EstadoForm, formData: FormData) => Promise<EstadoForm>;
  iniciais?: ValoresAmostra;
  cancelarHref: string;
  uploadHabilitado: boolean;
};

export function AmostraForm({ acao, iniciais = {}, cancelarHref, uploadHabilitado }: Props) {
  const [estado, formAction, pendente] = useActionState(acao, {});
  // Após um erro de validação, o servidor devolve o que foi digitado.
  const v: ValoresAmostra = { ...iniciais, ...estado.valores };
  const erro = (campo: string) => estado.erros?.[campo]?.[0];
  // `key` muda a cada resposta, remontando os campos não controlados com os valores devolvidos.
  const chave = JSON.stringify(estado.valores ?? {});

  const [lat, setLat] = useState(v.latitude ?? "");
  const [lng, setLng] = useState(v.longitude ?? "");
  const [fotoUrl, setFotoUrl] = useState(v.fotoUrl ?? "");
  const [localizando, setLocalizando] = useState(false);

  const latNum = parseFloat(lat);
  const lngNum = parseFloat(lng);
  const selecionado =
    Number.isFinite(latNum) && Number.isFinite(lngNum) && Math.abs(latNum) <= 90 && Math.abs(lngNum) <= 180
      ? { lat: latNum, lng: lngNum }
      : null;

  function definirLocal(novaLat: number, novaLng: number) {
    setLat(novaLat.toFixed(6));
    setLng(novaLng.toFixed(6));
  }

  function usarGps() {
    if (!navigator.geolocation) {
      toast.error("Geolocalização não suportada neste navegador.");
      return;
    }
    setLocalizando(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        definirLocal(pos.coords.latitude, pos.coords.longitude);
        setLocalizando(false);
      },
      () => {
        toast.error("Não foi possível obter sua localização.");
        setLocalizando(false);
      },
      { enableHighAccuracy: true, timeout: 15000 },
    );
  }

  return (
    <form action={formAction} className="grid gap-6" key={chave}>
      {estado.mensagem && <p className="text-sm text-destructive">{estado.mensagem}</p>}

      <div className="grid gap-4 sm:grid-cols-2">
        <Campo label="Título" erro={erro("titulo")} htmlFor="titulo" className="sm:col-span-2">
          <Input
            id="titulo"
            name="titulo"
            defaultValue={v.titulo}
            placeholder="Ex.: Afloramento de granito — Ponto 3"
            aria-invalid={!!erro("titulo")}
          />
        </Campo>

        <Campo label="Tipo" erro={erro("tipo")} htmlFor="tipo">
          <CampoSelect id="tipo" name="tipo" defaultValue={v.tipo ?? ""} aria-invalid={!!erro("tipo")}>
            <option value="" disabled>
              Selecione…
            </option>
            {TIPOS.map((t) => (
              <option key={t.valor} value={t.valor}>
                {t.rotulo}
              </option>
            ))}
          </CampoSelect>
        </Campo>

        <Campo label="Data da coleta" erro={erro("dataColeta")} htmlFor="dataColeta">
          <Input
            id="dataColeta"
            name="dataColeta"
            type="date"
            defaultValue={v.dataColeta}
            aria-invalid={!!erro("dataColeta")}
          />
        </Campo>
      </div>

      <fieldset className="grid gap-3">
        <legend className="mb-1 text-sm font-medium">Local da coleta</legend>
        <p className="text-sm text-muted-foreground">
          Clique no mapa, use o GPS do aparelho ou digite as coordenadas (graus decimais).
        </p>
        <div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-start">
          <Campo label="Latitude" erro={erro("latitude")} htmlFor="latitude">
            <Input
              id="latitude"
              name="latitude"
              inputMode="decimal"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              placeholder="-23.550520"
              aria-invalid={!!erro("latitude")}
            />
          </Campo>
          <Campo label="Longitude" erro={erro("longitude")} htmlFor="longitude">
            <Input
              id="longitude"
              name="longitude"
              inputMode="decimal"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              placeholder="-46.633308"
              aria-invalid={!!erro("longitude")}
            />
          </Campo>
          <Button type="button" variant="outline" onClick={usarGps} disabled={localizando} className="sm:mt-6">
            {localizando ? <Loader2 className="animate-spin" /> : <LocateFixed />}
            Usar GPS
          </Button>
        </div>
        <Mapa pontos={[]} aoClicar={definirLocal} selecionado={selecionado} altura="320px" />
      </fieldset>

      <Campo label="Foto" htmlFor="foto" erro={erro("fotoUrl")}>
        <input type="hidden" name="fotoUrl" value={fotoUrl} />
        {fotoUrl ? (
          <div className="relative w-fit">
            <Image
              src={fotoUrl}
              alt="Foto da amostra"
              width={320}
              height={240}
              className="h-48 w-auto rounded-lg border object-cover"
            />
            <Button
              type="button"
              size="icon-sm"
              variant="secondary"
              className="absolute top-2 right-2"
              onClick={() => setFotoUrl("")}
              aria-label="Remover foto"
            >
              <X />
            </Button>
          </div>
        ) : uploadHabilitado ? (
          <UploadButton
            endpoint="fotoAmostra"
            className="items-start ut-button:bg-primary ut-button:text-sm ut-button:text-primary-foreground ut-allowed-content:text-muted-foreground"
            content={{ button: "Enviar foto", allowedContent: "Imagem até 4 MB" }}
            onClientUploadComplete={(res) => {
              const url = res[0]?.ufsUrl;
              if (url) setFotoUrl(url);
              toast.success("Foto enviada!");
            }}
            onUploadError={(e) => {
              toast.error(`Falha no upload: ${e.message}`);
            }}
          />
        ) : (
          <p className="text-sm text-muted-foreground">
            Upload desativado — defina UPLOADTHING_TOKEN no .env para habilitar.
          </p>
        )}
      </Campo>

      <Campo label="Observações" erro={erro("observacoes")} htmlFor="observacoes">
        <Textarea
          id="observacoes"
          name="observacoes"
          rows={5}
          defaultValue={v.observacoes}
          placeholder="Litologia, cor, textura, profundidade, condições do afloramento…"
        />
      </Campo>

      <div className="flex gap-3">
        <Button type="submit" disabled={pendente}>
          {pendente && <Loader2 className="animate-spin" />}
          Salvar amostra
        </Button>
        <Link href={cancelarHref} className={buttonVariants({ variant: "ghost" })}>
          Cancelar
        </Link>
      </div>
    </form>
  );
}

function Campo({
  label,
  htmlFor,
  erro,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  erro?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("grid gap-1.5", className)}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {erro && <p className="text-sm text-destructive">{erro}</p>}
    </div>
  );
}
