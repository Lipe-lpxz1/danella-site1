import { useEffect, useRef, useState } from "react";
import origemAsset from "@/assets/origem.webp";
import travessiaAsset from "@/assets/travessia.webp";
import presencaAsset from "@/assets/presenca.webp";
import { SectionLabel } from "@/components/SectionLabel";
import { SmartImage } from "@/components/SmartImage";

// Os três "capítulos" da história contada nesta seção, cada um com
// um número, título, texto e imagem de fundo correspondente.
const chapters = [
  {
    no: "I",
    title: "Origem",
    text: "Nascida em Goianésia, Goiás, Danella realizou seu primeiro show aos 20 anos, em Jaraguá, no ano de 2004. Diante de um público que chegou a ultrapassar 2.000 pessoas e com repercussão na imprensa local, aquele momento marcou o início de uma jornada que transformaria um sonho de infância em uma carreira de sucesso.",
    img: origemAsset,
  },
  {
    no: "II",
    title: "Travessia",
    text: "Ao longo de sua trajetória, Danella enfrentou desafios comuns a muitos artistas, incluindo a pressão para seguir caminhos que não representavam sua identidade. Em determinado momento, decidiu reestruturar sua carreira, assumindo a gestão do próprio trabalho e fortalecendo sua atuação como empresária. Essa fase marcou uma nova etapa de crescimento, consolidando sua presença no universo do piseiro e da vaquejada.",
    img: travessiaAsset,
  },
  {
    no: "III",
    title: "Presença",
    text: "Nos dias de hoje, Danella é uma artista nacional consolidada, de nome e entrega, que leva aos palcos profissionalismo, segurança e a maturidade de quem transforma experiência em presença. Tal como um bom vinho, sua arte amadureceu com o tempo.",
    img: presencaAsset,
  },
];

// Seção "A jornada": no desktop, a imagem de fundo muda conforme o
// capítulo mais próximo do centro da tela durante o scroll (efeito
// chamado de "scrollytelling"). No celular, os três capítulos aparecem
// um abaixo do outro, cada um já com sua própria imagem, sem esse efeito.
export function Scrollytelling() {
  // Índice do capítulo atualmente "ativo" (o mais próximo do centro da tela).
  const [active, setActive] = useState(0);
  // Referências para cada <li> de capítulo, usadas para medir a posição deles na tela.
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    let raf = 0;

    // Calcula qual capítulo está com o centro mais próximo do centro
    // vertical da janela, e marca esse como o capítulo ativo.
    const compute = () => {
      const center = window.innerHeight / 2;
      let bestIdx = 0;
      let bestDist = Infinity;
      refs.current.forEach((el, i) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const elCenter = rect.top + rect.height / 2;
        const dist = Math.abs(elCenter - center);
        if (dist < bestDist) {
          bestDist = dist;
          bestIdx = i;
        }
      });
      setActive(bestIdx);
    };

    // Usa requestAnimationFrame para não recalcular a cada pixel rolado,
    // evitando travamentos durante o scroll.
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section className="relative border-t border-border">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,theme(colors.brand.accent/8%),transparent_60%)]" />

      <div className="mx-auto max-w-7xl px-6 pt-32 md:px-10 md:pt-44">
        <div className="grid gap-6 md:grid-cols-12">
          <div className="md:col-span-5">
            <SectionLabel index="02">A jornada</SectionLabel>
            <h2 className="mt-6 font-display title-fluid text-balance">
              Três capítulos, <em className="text-brand-accent">uma só voz</em>.
            </h2>
          </div>
        </div>
      </div>

      {/* Versão mobile: cada capítulo com sua própria imagem, em lista vertical simples */}
      <div className="mx-auto flex max-w-7xl flex-col gap-16 px-6 py-16 md:hidden">
        {chapters.map((c) => (
          <article key={c.no} className="flex flex-col gap-5">
            <div>
              <span className="font-display text-2xl italic text-brand-accent">{c.no}</span>
              <h3 className="mt-2 font-display text-3xl">{c.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-brand-light/70">{c.text}</p>
            </div>
            <div className="relative aspect-[4/5] w-full overflow-hidden">
              <SmartImage
                src={c.img}
                alt={c.title}
                loading="lazy"
                width={1000}
                height={1000}
                className="h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-dark/40 to-transparent" />
            </div>
          </article>
        ))}
      </div>

      {/* Versão desktop: textos em lista na esquerda, imagem fixa (sticky)
          na direita que troca de capítulo conforme o scroll */}
      <div className="mx-auto hidden max-w-7xl grid-cols-[minmax(0,1fr)_416px] gap-10 px-6 py-28 md:grid lg:grid-cols-12 lg:gap-16 lg:px-10">
        <ol className="min-w-0 lg:col-span-5">
          {chapters.map((c, i) => (
            <li
              key={c.no}
              ref={(el) => {
                refs.current[i] = el;
              }}
              data-idx={i}
              className="flex min-h-[70vh] flex-col justify-center"
            >
              {/* Capítulos não ativos ficam esmaecidos e levemente deslocados */}
              <div
                className="transition-all duration-1000 ease-out"
                style={{
                  opacity: active === i ? 1 : 0.25,
                  transform: active === i ? "translateY(0)" : "translateY(8px)",
                }}
              >
                <span className="font-display text-2xl italic text-brand-accent">{c.no}</span>
                <h3 className="mt-2 font-display text-4xl">{c.title}</h3>
                <p className="mt-3 max-w-md text-base leading-relaxed text-brand-light/70">
                  {c.text}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className="flex justify-start lg:col-span-6 lg:col-start-7">
          {/* Bloco de imagem "preso" na tela (sticky) enquanto a coluna de
              texto rola — todas as imagens ficam empilhadas e a do
              capítulo ativo aparece por cima, com um fade suave. */}
          <div className="sticky top-24 h-[520px] w-[416px] shrink-0 overflow-hidden">
            {chapters.map((c, i) => (
              <img
                decoding="async"
                key={c.no}
                src={c.img}
                alt={c.title}
                loading="eager"
                width={1000}
                height={1000}
                className="absolute inset-0 h-full w-full object-cover transition-all duration-[1400ms] ease-out"
                style={{
                  opacity: active === i ? 1 : 0,
                  transform: active === i ? "scale(1)" : "scale(1.04)",
                }}
              />
            ))}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-dark/40 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
