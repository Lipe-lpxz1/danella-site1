import { Link } from "@tanstack/react-router";
import { AGENDA_VISIBLE } from "@/lib/feature-flags";

// Rodapé exibido em todas as páginas do site: nome/bio curta, menu de
// navegação, dados de contato e links para redes sociais.
export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-brand-dark px-6 pb-10 pt-24 md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-16 md:grid-cols-3">
          <div>
            <p className="font-display text-3xl tracking-wide">Danella</p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-brand-light/55">
              Cantora, empresária e compositora. A Rainha do Piseiro — um legado que atravessa
              gerações.
            </p>
          </div>

          <div>
            <p className="mb-5 text-[10px] uppercase tracking-luxury text-brand-accent">
              Navegação
            </p>
            <ul className="space-y-3 text-sm text-brand-light/70">
              <li>
                <Link to="/sobre" className="hover:text-brand-accent">
                  Sobre
                </Link>
              </li>
              {AGENDA_VISIBLE && (
                <li>
                  <Link to="/agenda" className="hover:text-brand-accent">
                    Agenda
                  </Link>
                </li>
              )}
              <li>
                <Link to="/discografia" className="hover:text-brand-accent">
                  Discografia
                </Link>
              </li>
              <li>
                <Link to="/contato" className="hover:text-brand-accent">
                  Contratação
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-5 text-[10px] uppercase tracking-luxury text-brand-accent">Contato</p>
            <a
              href="mailto:Danielaribeirocontato@hotmail.com"
              className="block font-display text-xl italic text-brand-light hover:text-brand-accent break-all"
            >
              Danielaribeirocontato@hotmail.com
            </a>
            <p className="mt-2 text-sm text-brand-light/55">+55 11 98837-7539</p>
          </div>
        </div>

        <div className="mt-20 flex flex-col items-center justify-between gap-6 border-t border-border pt-8 md:flex-row">
          <p className="text-[10px] uppercase tracking-luxury text-brand-light/40">
            © {new Date().getFullYear()} Danella. Todos os direitos reservados.
          </p>
          <div className="flex gap-8 text-[10px] uppercase tracking-luxury">
            <a
              href="https://www.instagram.com/danellaoficial/"
              target="_blank"
              rel="noreferrer"
              className="text-brand-light/60 hover:text-brand-accent"
            >
              Instagram
            </a>
            <a
              href="https://open.spotify.com/artist/6rFydUcUXtAiW2DBXtgZa8?si=51vPO8yUTMm1dfYLN4xqWQ"
              target="_blank"
              rel="noreferrer"
              className="text-brand-light/60 hover:text-brand-accent"
            >
              Spotify
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
