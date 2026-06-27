import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AGENDA_VISIBLE } from "@/lib/feature-flags";

// Itens do menu de navegação. O item "Agenda" só aparece se a flag
// AGENDA_VISIBLE estiver ativada em lib/feature-flags.ts.
const links = [
  { to: "/", label: "Home" },
  { to: "/sobre", label: "Sobre" },
  ...(AGENDA_VISIBLE ? [{ to: "/agenda", label: "Agenda" } as const] : []),
  { to: "/galeria", label: "Galeria" },
  { to: "/discografia", label: "Discografia" },
  { to: "/videos", label: "Vídeos" },
  { to: "/contato", label: "Contato" },
] as const;

// Cabeçalho fixo no topo do site, com o menu de navegação.
// Em telas grandes mostra os links na horizontal; em telas pequenas
// mostra um botão "hambúrguer" que abre um menu suspenso.
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Detecta se a página já foi rolada para baixo, para escurecer
  // o fundo do cabeçalho (efeito de "vidro" ao rolar a página).
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        scrolled ? "bg-brand-dark/80 backdrop-blur-md border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 md:px-10">
        <Link
          to="/"
          className="font-display text-lg uppercase tracking-luxury text-brand-light"
          onClick={() => setOpen(false)}
        >
          Danella
        </Link>

        {/* Menu horizontal, visível apenas em telas grandes (desktop) */}
        <nav className="hidden items-center gap-9 lg:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              className="shrink-0 text-[10px] font-medium uppercase tracking-luxury text-brand-light/70 transition-colors hover:text-brand-accent data-[status=active]:text-brand-accent"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Botão "hambúrguer" (visível apenas em telas pequenas) que
            abre/fecha o menu mobile. As duas barras formam um "X" quando aberto. */}
        <button
          aria-label="Abrir menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
        >
          <span
            className={`h-px w-6 bg-brand-light transition-transform ${open ? "translate-y-[3px] rotate-45" : ""}`}
          />
          <span
            className={`h-px w-6 bg-brand-light transition-transform ${open ? "-translate-y-[3px] -rotate-45" : ""}`}
          />
        </button>
      </div>

      {/* Menu suspenso mobile: some/aparece controlando a altura máxima
          e a opacidade, criando uma transição suave de abertura. */}
      <div
        className={`lg:hidden overflow-hidden bg-brand-dark/95 backdrop-blur-md transition-[max-height,opacity] duration-500 ${
          open ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col gap-2 px-6 pb-10 pt-4">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              activeOptions={{ exact: l.to === "/" }}
              className="border-b border-border py-4 font-display text-2xl text-brand-light/80 data-[status=active]:text-brand-accent"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
