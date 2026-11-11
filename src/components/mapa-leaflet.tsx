"use client";

import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import Link from "next/link";
import { CircleMarker, MapContainer, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { latLngBounds } from "leaflet";
import type { PontoMapa } from "@/lib/pontos";
import { TIPO_INFO } from "@/lib/tipos";

const CENTRO_BRASIL: [number, number] = [-14.235, -51.925];

type Props = {
  pontos: PontoMapa[];
  /** Se informado, clicar no mapa chama esta função (modo seleção de local). */
  aoClicar?: (lat: number, lng: number) => void;
  /** Ponto selecionado no modo seleção. */
  selecionado?: { lat: number; lng: number } | null;
  altura?: string;
};

export default function MapaLeaflet({ pontos, aoClicar, selecionado, altura = "500px" }: Props) {
  const centro: [number, number] = selecionado
    ? [selecionado.lat, selecionado.lng]
    : pontos[0]
      ? [pontos[0].latitude, pontos[0].longitude]
      : CENTRO_BRASIL;

  return (
    <MapContainer
      center={centro}
      zoom={selecionado || pontos.length ? 10 : 4}
      style={{ height: altura, width: "100%" }}
      className="z-0 rounded-lg border"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {pontos.map((p) => (
        <CircleMarker
          key={p.id}
          center={[p.latitude, p.longitude]}
          radius={8}
          pathOptions={{ color: "#fff", weight: 2, fillColor: TIPO_INFO[p.tipo].cor, fillOpacity: 0.9 }}
        >
          <Popup>
            <strong>{p.titulo}</strong>
            <br />
            {TIPO_INFO[p.tipo].rotulo} · {p.dataColeta.split("-").reverse().join("/")}
            <br />
            <Link href={`/amostras/${p.id}`}>Ver amostra →</Link>
          </Popup>
        </CircleMarker>
      ))}

      {selecionado && (
        <CircleMarker
          center={[selecionado.lat, selecionado.lng]}
          radius={10}
          pathOptions={{ color: "#fff", weight: 3, fillColor: "#dc2626", fillOpacity: 1 }}
        />
      )}

      {aoClicar && <CliqueNoMapa aoClicar={aoClicar} />}
      {!aoClicar && pontos.length > 1 && <AjustarAosPontos pontos={pontos} />}
      {selecionado && <SeguirSelecao lat={selecionado.lat} lng={selecionado.lng} />}
    </MapContainer>
  );
}

function CliqueNoMapa({ aoClicar }: { aoClicar: (lat: number, lng: number) => void }) {
  useMapEvents({ click: (e) => aoClicar(e.latlng.lat, e.latlng.lng) });
  return null;
}

function AjustarAosPontos({ pontos }: { pontos: PontoMapa[] }) {
  const map = useMap();
  useEffect(() => {
    const limites = latLngBounds(pontos.map((p) => [p.latitude, p.longitude]));
    map.fitBounds(limites, { padding: [40, 40], maxZoom: 14 });
  }, [map, pontos]);
  return null;
}

/** Centraliza o mapa quando a seleção muda por fora (digitação ou GPS). */
function SeguirSelecao({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    if (!map.getBounds().contains([lat, lng])) map.setView([lat, lng]);
  }, [map, lat, lng]);
  return null;
}
