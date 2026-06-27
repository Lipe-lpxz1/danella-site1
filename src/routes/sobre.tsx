import { createFileRoute } from "@tanstack/react-router";
import sobreImg from "@/assets/sobre-danella.webp";
import { SectionLabel } from "@/components/SectionLabel";
import { SmartImage } from "@/components/SmartImage";

// Registra a rota "/sobre" (biografia) e seus metadados.
export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre — Danella" },
      {
        name: "description",
        content: "A trajetória de Danella: formação, influências e o caminho na música.",
      },
      { property: "og:title", content: "Sobre Danella" },
      { property: "og:description", content: "Biografia da cantora Danella." },
      { property: "og:url", content: "/sobre" },
    ],
    links: [{ rel: "canonical", href: "/sobre" }],
  }),
  component: SobrePage,
});

// Página "/sobre": retrato + texto de biografia em colunas (desktop) e,
// no mobile/tablet, a foto flutua ao lado do início do texto (efeito
// parecido com o usado na página de discografia).
function SobrePage() {
  return (
    <article className="px-6 pt-40 pb-32 md:px-10 md:pt-48">
      <div className="mx-auto max-w-7xl">
        <header className="mb-20 max-w-3xl animate-fade-up">
          <SectionLabel index="01">Biografia</SectionLabel>
          <h1 className="mt-6 font-display title-fluid text-balance">Onde Tudo se Conecta</h1>
        </header>

        <div className="sobre-layout lg:grid lg:grid-cols-12 lg:gap-16">
          <figure className="sobre-figure mb-8 lg:col-span-5">
            <SmartImage
              src={sobreImg}
              alt="Retrato editorial de Danella"
              loading="eager"
              fetchPriority="high"
              width={1200}
              height={1800}
              className="w-full object-cover"
            />
          </figure>

          <div className="sobre-bio space-y-4 text-sm leading-relaxed text-brand-light/75 md:space-y-6 md:text-lg lg:col-span-6 lg:col-start-7">
            <p>
              Nascida em Goiás e atualmente sediada em São Paulo, <strong>Danella</strong> construiu
              sua trajetória unindo sensibilidade artística, visão estratégica e forte presença de
              palco.
            </p>
            <p>
              À frente do projeto <em>Danella Connect in</em>, desenvolve um trabalho autoral focado
              em criar experiências marcantes através da música.
            </p>
            <p>
              Cantora, compositora e idealizadora do projeto Danella Connectin, a artista reúne
              sensibilidade artística, visão estratégica e presença de palco em uma carreira
              construída com consistência, dedicação e propósito.
            </p>
            <p>
              Sua identidade musical nasce das raízes brasileiras e ganha força através de
              performances que unem emoção, energia e proximidade com o público, consolidando
              Danella como um dos nomes em ascensão no cenário nacional.
            </p>

            {/* Ficha rápida com dados resumidos da artista */}
            <dl className="clear-both mt-12 grid grid-cols-2 gap-y-8 border-t border-border pt-12">
              <div>
                <dt className="text-[10px] uppercase tracking-luxury text-brand-accent">Origem</dt>
                <dd className="mt-2 font-display text-2xl">Goiás, BR</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-luxury text-brand-accent">Base</dt>
                <dd className="mt-2 font-display text-2xl">São Paulo, BR</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-luxury text-brand-accent">Projeto</dt>
                <dd className="mt-2 font-display text-2xl">Danella Connect in</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-luxury text-brand-accent">Atuação</dt>
                <dd className="mt-2 font-display text-2xl">Cantora · Compositora</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </article>
  );
}
