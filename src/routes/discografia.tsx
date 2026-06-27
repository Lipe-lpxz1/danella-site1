import { createFileRoute } from "@tanstack/react-router";
import { SectionLabel } from "@/components/SectionLabel";
import { SmartImage } from "@/components/SmartImage";
import album1 from "@/assets/album-1.webp";
import album2 from "@/assets/album-2.webp";
import album3 from "@/assets/album-3.webp";

// Registra a rota "/discografia" e os metadados (título da aba,
// descrição para buscadores, dados para compartilhamento em redes sociais).
export const Route = createFileRoute("/discografia")({
  head: () => ({
    meta: [
      { title: "Discografia — Danella" },
      { name: "description", content: "Álbuns, EPs e singles de Danella." },
      { property: "og:title", content: "Discografia — Danella" },
      { property: "og:description", content: "Ouça toda a obra fonográfica." },
      { property: "og:url", content: "/discografia" },
    ],
    links: [{ rel: "canonical", href: "/discografia" }],
  }),
  component: DiscografiaPage,
});

// Lista das músicas/álbuns exibidos na página. Para adicionar uma nova
// música, basta acrescentar um novo objeto a este array.
const records = [
  {
    cover: album1,
    title: "Estamos Longe",
    year: "2026",
    type: "Single",
    spotify: "1DFixLWuPkv3KT3TnV35m3",
    description:
      "Inspirada no clássico 'Creep' mas com o ritmo contagiante do forró e do baião, a música 'Estamos Longe' é uma celebração da conexão energética e da liberdade de ser quem se é. Ela narra a história de um amor onde não é preciso 'pisar em ovos', onde a distância apenas intensifica a saudade gostosa e a certeza de um sentimento conectado e verdadeiro. Uma música para cantar, dançar e celebrar a beleza de um amor correspondido.",
  },
  {
    cover: album2,
    title: "Te Amo na Minha Cabeça",
    year: "2026",
    type: "Single",
    spotify: "1DFixLWuPkv3KT3TnV35m3",
    description:
      "A música 'Te Amo na Minha Cabeça' é um mergulho profundo na doçura e na melancolia de um amor vivido em segredo. Ela conta a história de quem, por entrelaçar sentimentos platônicos e o desejo de estar perto, escolhe cuidar e servir em silêncio. É uma narrativa sobre a plenitude encontrada na imaginação e sobre a esperança secreta de que, talvez, esse sentimento seja recíproco. Uma música para se deixar levar pelas emoções e sonhar com o que existe apenas no imaginário.",
  },
  {
    cover: album3,
    title: "Nosso Amor",
    year: "2025",
    type: "Single",
    spotify: "1DFixLWuPkv3KT3TnV35m3",
    description:
      "Fruto de uma parceria emocionante com o icônico rapper Pepeu, a música 'Nosso Amor' é uma ode a um amor de outras eras. Com uma fusão envolvente, a canção celebra a conexão telepática, o desejo intenso e a certeza de que algumas almas foram feitas para se encontrar. Uma música para sentir, dançar e celebrar a plenitude de um amor indescritível.",
  },
];

// Player de música embutido do Spotify (mesma playlist para todas as
// músicas). A altura é controlada via CSS (.discografia-player) para
// manter sempre a mesma proporção do player em qualquer tamanho de tela.
function SpotifyPlayer({ title }: { title: string }) {
  return (
    <div className="overflow-hidden rounded-sm">
      <iframe
        title={`Spotify ${title}`}
        src="https://open.spotify.com/embed/playlist/16P1nQXM2VTPz4ugAQ1LaW?utm_source=generator&theme=0"
        className="discografia-player block w-full"
        height={352}
        frameBorder={0}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        // Restringe o que o conteúdo embutido pode fazer: permite scripts
        // (necessário para o player funcionar) mas bloqueia navegação da
        // página principal, abertura de popups, downloads automáticos, etc.
        // Camada extra de proteção mesmo confiando no domínio do Spotify.
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        loading="eager"
      />
    </div>
  );
}

// Página "/discografia": lista cada música em um bloco com capa,
// título, descrição e o player do Spotify.
//
// No desktop, a capa fica numa coluna separada ao lado do texto.
// No mobile/tablet, a capa flutua à esquerda do início do texto,
// fazendo a descrição "abraçar" a capa — mas o player do Spotify
// fica sempre abaixo de toda a descrição, ocupando a largura cheia,
// igual ao desktop (sem flutuar no meio do texto).
function DiscografiaPage() {
  return (
    <section className="px-6 pt-32 pb-20 md:px-10 md:pt-40 md:pb-28 lg:pt-48 lg:pb-32">
      <div className="mx-auto max-w-7xl">
        <header className="mb-12 max-w-3xl animate-fade-up md:mb-16 lg:mb-20">
          <SectionLabel index="04">Discografia</SectionLabel>
          <h1 className="mt-6 font-display title-fluid text-balance">
            Músicas <em>autorais</em>.
          </h1>
        </header>

        <div className="space-y-12 md:space-y-20 lg:space-y-32">
          {records.map((r, i) => (
            <article
              key={r.title}
              // Em telas grandes (lg), os álbuns em posição ímpar (1, 3...)
              // invertem a ordem das colunas, alternando capa esquerda/direita.
              className={`discografia-record md:grid md:grid-cols-[minmax(260px,42%)_1fr] md:gap-10 lg:grid-cols-2 lg:items-center lg:gap-20 ${
                i % 2 === 1 ? "lg:[&>figure]:order-2" : ""
              }`}
            >
              {/* Capa exclusiva do desktop: ocupa a coluna própria do grid.
                  Fica escondida no mobile (hidden md:block). */}
              <figure className="discografia-cover group relative hidden w-full overflow-hidden md:block">
                <SmartImage
                  src={r.cover}
                  alt={`Capa do álbum ${r.title}`}
                  loading="lazy"
                  width={800}
                  height={800}
                  className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </figure>
              <div className="discografia-copy min-w-0 self-center md:self-auto">
                {/* Ano/tipo e título ficam sempre em linha cheia, antes de
                    qualquer elemento flutuante — igual ao layout do desktop. */}
                <p className="text-[10px] uppercase tracking-luxury text-brand-accent">
                  {r.year} · {r.type}
                </p>
                <h2 className="mt-4 font-display title-fluid">{r.title}</h2>

                {/* Bloco exclusivo do mobile/tablet: a capa flutua à
                    esquerda do início do texto, e a descrição corre por
                    cima e ao redor dela até terminar. O player vem
                    depois, já abaixo de toda a descrição (sem flutuar). */}
                <div className="md:hidden">
                  <figure className="discografia-cover group relative float-left mr-4 mb-2 mt-6 w-[38%] overflow-hidden">
                    <SmartImage
                      src={r.cover}
                      alt={`Capa do álbum ${r.title}`}
                      loading="lazy"
                      width={800}
                      height={800}
                      className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </figure>
                  <p className="discografia-description max-w-none leading-relaxed text-brand-light/65">
                    {r.description}
                  </p>
                  {/* Desfaz o float da capa antes do player, garantindo que
                      ele comece sempre abaixo de todo o parágrafo, mesmo
                      que o texto seja mais curto que a altura da capa. */}
                  <div className="clear-both" />
                  <div className="mt-5">
                    <SpotifyPlayer title={r.title} />
                  </div>
                </div>

                {/* Bloco exclusivo do desktop: texto corrido, sem floats,
                    com o player abaixo da descrição. */}
                <div className="hidden md:block">
                  <p className="discografia-description mt-6 max-w-md leading-relaxed text-brand-light/65">
                    {r.description}
                  </p>
                  <div className="mt-5 md:mt-8">
                    <SpotifyPlayer title={r.title} />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
