import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SectionLabel } from "@/components/SectionLabel";
import { SmartImage } from "@/components/SmartImage";
import gallery1 from "@/assets/gallery-1.webp";
import gallery2 from "@/assets/gallery-2.webp";
import gallery3 from "@/assets/gallery-3.webp";
import gallery4 from "@/assets/gallery-4.webp";
import gallery5 from "@/assets/gallery-5.webp";

// Registra a rota "/galeria" e seus metadados.
export const Route = createFileRoute("/galeria")({
  head: () => ({
    meta: [
      { title: "Galeria — Danella" },
      { name: "description", content: "Imagens de palco, estúdio e ensaios." },
      { property: "og:title", content: "Galeria — Danella" },
      { property: "og:description", content: "Visuais e bastidores." },
      { property: "og:url", content: "/galeria" },
    ],
    links: [{ rel: "canonical", href: "/galeria" }],
  }),
  component: GaleriaPage,
});

// Fotos exibidas na galeria, em ordem. Cada imagem tem sua legenda
// (usada só como texto descritivo, hoje não é mostrada na tela).
const images = [
  { src: gallery1, alt: "Danella vestido rosa", caption: "Ao vivo" },
  { src: gallery2, alt: "Danella vestido branco", caption: "Performance" },
  { src: gallery3, alt: "Danella vestido verde", caption: "Show" },
  { src: gallery4, alt: "Danella rosto vestido preto", caption: "Bastidores" },
  { src: gallery5, alt: "Danella show grande", caption: "Festival" },
];

// Página "/galeria": mosaico de fotos em tamanhos variados. Clicar em
// qualquer foto abre ela em destaque, em tela cheia (modo "lightbox").
function GaleriaPage() {
  // Guarda o índice da foto aberta em destaque; "null" significa
  // que nenhuma foto está aberta no momento.
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className="px-6 pt-40 pb-32 md:px-10 md:pt-48">
      <div className="mx-auto max-w-7xl">
        <header className="mb-16 max-w-3xl animate-fade-up">
          <SectionLabel index="03">Galeria</SectionLabel>
          <h1 className="mt-6 font-display title-fluid text-balance">
            Imagens em <em>movimento</em>.
          </h1>
        </header>

        {/* Mosaico de fotos em uma grade de 12 colunas — cada foto ocupa
            uma largura diferente (col-span) para criar o efeito de mosaico */}
        <div className="grid grid-cols-12 gap-3 md:gap-6">
          <button
            onClick={() => setActive(0)}
            className="gallery-tile group relative col-span-7 overflow-hidden"
          >
            <SmartImage
              src={images[0].src}
              alt={images[0].alt}
              loading="eager"
              fetchPriority="high"
              width={787}
              height={1400}
              className="aspect-[4/3] w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
          </button>
          <button
            onClick={() => setActive(1)}
            className="gallery-tile group relative col-span-5 overflow-hidden"
          >
            <SmartImage
              src={images[1].src}
              alt={images[1].alt}
              loading="eager"
              fetchPriority="high"
              width={581}
              height={1280}
              className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </button>
          <button
            onClick={() => setActive(2)}
            className="gallery-tile group relative col-span-5 overflow-hidden"
          >
            <SmartImage
              src={images[2].src}
              alt={images[2].alt}
              loading="lazy"
              width={1254}
              height={1254}
              className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </button>
          <button
            onClick={() => setActive(3)}
            className="gallery-tile group relative col-span-7 overflow-hidden"
          >
            <SmartImage
              src={images[3].src}
              alt={images[3].alt}
              loading="lazy"
              width={1045}
              height={1400}
              className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </button>
          <button
            onClick={() => setActive(4)}
            className="gallery-tile group relative col-span-12 overflow-hidden"
          >
            <SmartImage
              src={images[4].src}
              alt={images[4].alt}
              loading="lazy"
              width={1252}
              height={940}
              className="aspect-[16/9] w-full object-cover object-bottom transition-transform duration-700 group-hover:scale-105"
            />
          </button>
        </div>
      </div>

      {/* Modo "lightbox": some por cima de tudo, mostrando a foto
          selecionada em destaque. Clicar fora da foto ou no "Fechar" volta
          para a galeria normal. */}
      {active !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-dark/95 px-4 py-8 backdrop-blur-md animate-quick-fade-in"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            aria-label="Fechar"
            onClick={() => setActive(null)}
            className="absolute right-6 top-6 text-[10px] uppercase tracking-luxury text-brand-light/70 hover:text-brand-accent"
          >
            Fechar ✕
          </button>
          <figure className="max-h-full max-w-6xl">
            <SmartImage
              src={images[active].src}
              alt={images[active].alt}
              loading="eager"
              fetchPriority="high"
              className="max-h-[85vh] w-auto object-contain"
            />
          </figure>
        </div>
      )}
    </section>
  );
}
