import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

// IMPORTANTE: este valor está vazio. O ideal é preencher com o domínio
// completo do site assim que ele tiver uma URL definitiva, por exemplo:
// const BASE_URL = "https://www.danella.com.br";
// Sem isso, o sitemap gera links relativos (ex.: "/sobre") em vez de
// absolutos (ex.: "https://www.danella.com.br/sobre"), o que pode
// confundir buscadores como o Google ao indexar o site.
const BASE_URL = "";

// Gera o arquivo "/sitemap.xml" dinamicamente (sem precisar editar um
// arquivo XML manualmente). Buscadores como o Google leem esse arquivo
// para saber quais páginas existem no site e com que prioridade indexá-las.
export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        // Lista de páginas incluídas no sitemap.
        // OBS: "/agenda" está aqui mesmo estando oculta do menu (ver
        // lib/feature-flags.ts) — ou seja, buscadores podem indexar uma
        // página que os visitantes não conseguem encontrar navegando
        // pelo site. Remova esta linha se isso não for o desejado.
        const entries = [
          { path: "/", priority: "1.0" },
          { path: "/sobre", priority: "0.8" },
          { path: "/agenda", priority: "0.9" },
          { path: "/galeria", priority: "0.7" },
          { path: "/discografia", priority: "0.8" },
          { path: "/videos", priority: "0.7" },
          { path: "/contato", priority: "0.8" },
        ];
        const urls = entries
          .map(
            (e) =>
              `  <url>\n    <loc>${BASE_URL}${e.path}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`,
          )
          .join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
