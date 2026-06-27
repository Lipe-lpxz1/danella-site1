import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SectionLabel } from "@/components/SectionLabel";

// Registra a rota "/videos" e seus metadados.
export const Route = createFileRoute("/videos")({
  head: () => ({
    meta: [
      { title: "Vídeos — Danella" },
      { name: "description", content: "Clipes oficiais e performances ao vivo." },
      { property: "og:title", content: "Vídeos — Danella" },
      { property: "og:description", content: "Assista clipes e ao vivo." },
      { property: "og:url", content: "/videos" },
    ],
    links: [{ rel: "canonical", href: "/videos" }],
  }),
  component: VideosPage,
});

// IDs dos posts/reels do Instagram exibidos nesta página.
// Para adicionar um vídeo novo, basta colocar o ID do post do Instagram aqui.
const videos = [
  { id: "DZTir79OU3j", label: "Vídeo 01" },  
  { id: "DLxvezRvn58", label: "Vídeo 02" },
  { id: "DZXlXSmse1J", label: "Vídeo 03" },
  { id: "C-KxKuxs2h8", label: "Vídeo 04" },
  { id: "DERvxroOVM0", label: "Vídeo 05" },
  { id: "DEU3R0rRfdi", label: "Vídeo 06" },
];

// Monta a URL de incorporação (embed) de um post do Instagram a partir do ID.
const embedUrl = (id: string) => `https://www.instagram.com/p/${id}/embed/`;

// Página "/videos": um vídeo grande em destaque (o "ativo") e uma fila
// com miniaturas dos demais vídeos ao lado/abaixo. Clicar em uma
// miniatura troca qual vídeo aparece em destaque.
function VideosPage() {
  // Índice do vídeo atualmente em destaque (0 = primeiro vídeo da lista).
  const [active, setActive] = useState<number>(0);
  // Lista de miniaturas: todos os vídeos, exceto o que já está em destaque.
  const previewVideos = videos.filter((_, i) => i !== active);

  return (
    <section className="px-6 pt-40 pb-12 md:px-10 md:pb-16 md:pt-48">
      <div className="mx-auto max-w-7xl">
        <header className="mb-16 max-w-3xl animate-fade-up">
          <SectionLabel index="05">Vídeos</SectionLabel>
          <h1 className="mt-6 font-display title-fluid text-balance">
            Clipes e <em>shows</em>.
          </h1>
        </header>

        <div className="mx-auto grid w-full max-w-[540px] gap-6 lg:max-w-6xl lg:grid-cols-[minmax(420px,540px)_minmax(360px,1fr)] lg:items-start lg:gap-8">
          {/* Vídeo em destaque (o "ativo" no momento) */}
          <div className="w-full overflow-hidden rounded-sm border border-brand-light/10 bg-brand-muted shadow-2xl shadow-black/20">
            <iframe
              key={videos[active].id}
              title={`Instagram - ${videos[active].label}`}
              src={embedUrl(videos[active].id)}
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              allowFullScreen
              sandbox="allow-scripts allow-same-origin allow-forms"
              scrolling="no"
              className="block h-[690px] w-full md:h-[760px] lg:h-[960px]"
            />
          </div>

          {/* Fila de miniaturas dos outros vídeos — clicar em uma delas
              troca o vídeo em destaque acima */}
          <div className="flex gap-3 overflow-x-auto pb-2 md:justify-center lg:grid lg:grid-cols-2 lg:content-start lg:overflow-visible lg:pb-0">
            {previewVideos.map((v) => {
              const index = videos.findIndex((video) => video.id === v.id);

              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setActive(index)}
                  className="group relative h-52 w-36 shrink-0 overflow-hidden border border-brand-light/15 bg-brand-muted text-left transition-colors hover:border-brand-accent focus-visible:border-brand-accent focus-visible:outline-none lg:h-64 lg:w-full"
                >
                  <iframe
                    title={`Preview - ${v.label}`}
                    src={embedUrl(v.id)}
                    sandbox="allow-scripts allow-same-origin"
                    scrolling="no"
                    tabIndex={-1}
                    className="pointer-events-none h-full w-full scale-[1.02]"
                  />
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-dark via-brand-dark/70 to-transparent px-4 pb-4 pt-10 text-[10px] font-semibold uppercase tracking-luxury text-brand-light transition-colors group-hover:text-brand-accent">
                    {v.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
