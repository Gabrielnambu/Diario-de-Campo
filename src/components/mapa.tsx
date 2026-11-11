"use client";

import dynamic from "next/dynamic";

// Leaflet usa `window`, então o mapa só é renderizado no navegador.
export const Mapa = dynamic(() => import("./mapa-leaflet"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[320px] items-center justify-center rounded-lg border bg-muted text-sm text-muted-foreground">
      Carregando mapa…
    </div>
  ),
});
