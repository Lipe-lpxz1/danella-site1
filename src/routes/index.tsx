import { createFileRoute, Link } from "@tanstack/react-router";
import { AGENDA_VISIBLE } from "@/lib/feature-flags";
import heroAsset from "@/assets/hero-danella.webp";
import palcoAsset from "@/assets/globo-danella.webp";
import album1 from "@/assets/album-1.webp";
import { SectionLabel } from "@/components/SectionLabel";
import { Scrollytelling } from "@/components/Scrollytelling";
import { SmartImage } from "@/components/SmartImage";

// Registra a rota "/" (página inicial) e seus metadados.
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Danella — Cantora, intérprete e compositora" },
      {
        name: "description",
        content:
          "Site oficial de Danella. Ouça o novo álbum, veja a agenda de shows e contrate apresentações.",
      },
      { property: "og:title", content: "Danella — Site Oficial" },
      { property: "og:description", content: "Danella a Rainha do Piseiro." },
      { property: "og:url", content: "/" },
    ],
    links: [
      { rel: "canonical", href: "/" },
      // Avisa o navegador para já começar a baixar a imagem do topo
      // (hero) com prioridade alta, antes mesmo da página renderizar.
      { rel: "preload", as: "image", href: heroAsset, fetchpriority: "high" },
    ],
  }),
  component: HomePage,
});

// Página inicial do site, composta por várias seções, de cima para baixo:
// 1) Hero (imagem cheia + chamada principal)
// 2) Apresentação curta da artista
// 3) Linha do tempo "A jornada" (componente Scrollytelling)
// 4) Último lançamento + player do Spotify
// 5) Imagem de destaque com frase
// 6) Chamada para contratação de shows
function HomePage() {
  return (
    <>
      {/* Seção 1: imagem de fundo em tela cheia, título e botões de ação */}
      <section className="relative h-screen min-h-[680px] w-full overflow-hidden">
        <SmartImage
          src={heroAsset}
          alt="Danella em performance"
          width={754}
          height={1400}
          loading="eager"
          fetchPriority="high"
          className="hero-fixed-image hero-tinted"
          placeholderClassName="bg-brand-dark"
        />
        {/* Camadas de gradiente sobre a foto, para garantir contraste
            com o texto branco por cima */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/50 via-brand-dark/35 to-brand-dark" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/70 via-transparent to-brand-dark/40" />
        <div className="absolute inset-0 mix-blend-soft-light bg-[radial-gradient(ellipse_at_center,oklch(0.78_0.085_35/0.35),transparent_70%)]" />

        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-24 md:px-10 md:pb-32">
          <div className="max-w-3xl animate-fade-up">
            <p className="mb-6 text-[10px] uppercase tracking-hero text-brand-accent">
              Novo álbum • Disponível agora
            </p>
            <h1 className="font-display headline-fluid max-w-[11ch] text-balance text-brand-light">
              Danella <span className="italic">Connect in</span>
            </h1>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-brand-light/70 md:text-lg">
              Uma celebração dos encontros que só a música é capaz de criar.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/discografia"
                className="group inline-flex min-h-12 items-center justify-center gap-3 bg-brand-light px-6 py-4 text-center text-[10px] font-semibold uppercase tracking-luxury text-brand-dark transition-all hover:bg-brand-accent sm:px-8"
              >
                Ouvir agora
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
              {/* Botão "Próximos shows" só aparece quando a agenda estiver habilitada */}
              {AGENDA_VISIBLE && (
                <Link
                  to="/agenda"
                  className="inline-flex min-h-12 items-center justify-center gap-3 border border-brand-light/30 px-6 py-4 text-center text-[10px] font-semibold uppercase tracking-luxury text-brand-light transition-colors hover:border-brand-accent hover:text-brand-accent sm:px-8"
                >
                  Próximos shows
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Traço decorativo indicando que há mais conteúdo abaixo */}
        <div className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2">
          <div className="h-16 w-px bg-gradient-to-b from-brand-accent to-transparent" />
        </div>
      </section>

      {/* Seção 2: apresentação curta da artista, com link para a página "Sobre" */}
      <section className="reveal-block px-6 py-32 md:px-10 md:py-44">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-12">
            <SectionLabel index="01">A artista</SectionLabel>
          </div>
          <div className="md:col-span-9">
            <h2 className="font-display title-fluid text-balance">
              Uma voz que emociona e uma história construída com talento, carisma e{" "}
              <em className="text-brand-accent">paixão pela música</em>.
            </h2>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-brand-light/70 md:text-lg">
              Com uma carreira construída ao longo de mais de duas décadas, Danella leva sua voz aos
              grandes palcos com autenticidade, emoção e uma conexão única com o público. Entre
              sucessos da atualidade e canções que marcaram gerações, construiu uma trajetória
              marcada por carisma, presença e paixão pela música.
            </p>
            <Link
              to="/sobre"
              className="mt-10 inline-flex items-center gap-3 border-b border-brand-accent pb-1 text-[10px] uppercase tracking-luxury text-brand-light hover:text-brand-accent"
            >
              Ler biografia →
            </Link>
          </div>
        </div>
      </section>

      {/* Seção 3: linha do tempo com os "capítulos" da carreira */}
      <Scrollytelling />

      {/* Seção 4: destaque do lançamento mais recente, com player do Spotify */}
      <section className="reveal-block border-t border-border bg-brand-muted/30 px-6 py-12 md:px-10 lg:py-16">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[1.1fr_1fr] md:gap-16">
          <div>
            <SectionLabel index="03">Último lançamento</SectionLabel>
            <h2 className="mt-6 font-display title-fluid">Danella Connect in</h2>
            <p className="mt-6 max-w-md leading-relaxed text-brand-light/65">
              Uma celebração dos encontros que só a música é capaz de criar.
            </p>

            <div className="mt-10 overflow-hidden rounded-sm shadow-2xl">
              <iframe
                title="Playlist Spotify - Danella"
                src="https://open.spotify.com/embed/playlist/16P1nQXM2VTPz4ugAQ1LaW?utm_source=generator&theme=0"
                className="block w-full"
                height={352}
                frameBorder={0}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                // Mesma restrição de segurança aplicada ao player na
                // página de discografia (ver comentário em discografia.tsx).
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                loading="eager"
              />
            </div>
          </div>

          <div className="relative aspect-[4/5] w-full overflow-hidden shadow-2xl">
            <SmartImage
              src={album1}
              alt="Capa de single de Danella"
              loading="lazy"
              width={800}
              height={800}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-dark/50 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      {/* Seção 5: foto de destaque em largura total, com frase de impacto */}
      <section className="reveal-block relative h-[60vh] min-h-[420px] w-full overflow-hidden">
        <SmartImage
          src={palcoAsset}
          alt="Performance ao piano"
          loading="lazy"
          width={1328}
          height={624}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-12 mx-auto max-w-7xl px-6 md:px-10">
          <p className="font-display text-3xl italic text-brand-light/90 md:text-5xl whitespace-nowrap">
            "Cantar é transformar presença em conexão."
          </p>
        </div>
      </section>

      {/* Seção 6: chamada final para contratação de shows */}
      <section className="reveal-block px-6 py-32 md:px-10 md:py-44">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <SectionLabel index="04">Contratação</SectionLabel>
          <h2 className="mt-8 font-display title-fluid text-balance">
            Para um show, festival ou evento.
          </h2>
          <Link
            to="/contato"
            className="mt-12 inline-flex min-h-12 items-center justify-center gap-3 bg-brand-accent px-7 py-5 text-center text-[10px] font-semibold uppercase tracking-luxury text-brand-dark hover:bg-brand-light sm:px-10"
          >
            Solicitar proposta →
          </Link>
        </div>
      </section>
    </>
  );
}
