import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

// Formato esperado do handler real do servidor (gerado pelo TanStack Start).
type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

// Guarda a Promise do handler depois de importado uma vez,
// para não precisar reimportar o módulo em cada requisição.
let serverEntryPromise: Promise<ServerEntry> | undefined;

// Importa (uma única vez) o handler de servidor gerado pelo TanStack Start.
async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m as { default?: ServerEntry }).default ?? (m as unknown as ServerEntry),
    );
  }
  return serverEntryPromise;
}

// =========================================================================
// Headers de segurança HTTP, aplicados a TODA resposta do site (mesmo
// páginas de erro). Cada um protege contra um tipo diferente de ataque
// comum em sites — nenhum deles depende de dados do visitante, então
// não têm efeito colateral no funcionamento normal do site.
// =========================================================================
const SECURITY_HEADERS: Record<string, string> = {
  // Impede que o site seja colocado dentro de um <iframe> em outro
  // domínio (técnica de ataque chamada "clickjacking", onde o site é
  // escondido por baixo de botões falsos em outra página).
  "X-Frame-Options": "DENY",
  // Impede que o navegador tente "adivinhar" o tipo de um arquivo
  // diferente do que o servidor declarou — evita que um arquivo
  // disfarçado (ex.: uma imagem que na verdade é um script) seja
  // executado como se fosse código.
  "X-Content-Type-Options": "nosniff",
  // Controla quanta informação da URL atual é enviada para outros
  // sites quando o visitante clica em um link que leva para fora do
  // site (ex.: para o Spotify ou Instagram). "strict-origin-when-cross-origin"
  // só envia o domínio (não o caminho completo) para sites externos.
  "Referrer-Policy": "strict-origin-when-cross-origin",
  // Desativa o acesso a APIs sensíveis do navegador (câmera, microfone,
  // geolocalização) que este site não usa em nenhuma página.
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  // Força o navegador a sempre usar HTTPS (nunca HTTP sem criptografia)
  // ao acessar este site, por 2 anos, incluindo subdomínios.
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  // Content-Security-Policy (CSP): lista explicitamente de onde o site
  // pode carregar cada tipo de recurso. Qualquer coisa fora dessa lista
  // é bloqueada pelo navegador — é a principal defesa contra scripts
  // maliciosos injetados (XSS), mesmo que apareçam por outro meio.
  //   default-src 'self'      -> por padrão, só recursos do próprio site
  //   script-src 'self'       -> só roda JavaScript vindo do próprio site
  //   style-src + Google Fonts -> permite os estilos do site e as fontes
  //   font-src + Google Fonts -> os arquivos de fonte em si
  //   frame-src Spotify/Instagram -> só esses dois domínios podem ser
  //                                  exibidos em <iframe> no site
  //   connect-src 'self'      -> o site só pode "conversar" com seu
  //                              próprio domínio via fetch/XHR
  //   object-src 'none'       -> bloqueia plugins antigos (Flash, etc.)
  //   base-uri 'self'         -> impede um ataque que troca a URL base
  //                              da página por uma maliciosa
  //   frame-ancestors 'none'  -> reforça a mesma proteção do X-Frame-Options
  //                              acima, de um jeito mais moderno
  "Content-Security-Policy": [
    "default-src 'self'",
    // 'unsafe-inline' em script-src: o TanStack Start (framework usado
    // neste site) pode injetar um pequeno script inline no HTML para
    // "hidratar" a página (reconectar o React ao HTML já pronto vindo
    // do servidor). Sem essa permissão, o site pode carregar a aparência
    // mas perder a interatividade (menus, formulários, etc.). Se no
    // futuro isso for confirmado como não-necessário, pode ser removido
    // para tornar a proteção contra XSS ainda mais forte.
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "frame-src https://open.spotify.com https://www.instagram.com",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
  ].join("; "),
};

// Aplica os headers de segurança acima a uma resposta, sem sobrescrever
// nenhum header que o próprio TanStack Start já tenha definido.
function withSecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    if (!headers.has(name)) {
      headers.set(name, value);
    }
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

// Monta uma resposta de erro 500 com a página de erro personalizada do site,
// em vez de deixar passar uma resposta crua/sem estilo para o visitante.
function brandedErrorResponse(): Response {
  return withSecurityHeaders(
    new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    }),
  );
}

// Verifica se o corpo da resposta é, na verdade, um erro interno do servidor
// de SSR (h3) que foi "engolido" e devolvido como um JSON genérico em vez
// de lançar uma exceção de verdade. Isso evita mostrar esse JSON cru ao usuário.
function isCatastrophicSsrErrorBody(body: string, responseStatus: number): boolean {
  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    return false;
  }

  if (!payload || Array.isArray(payload) || typeof payload !== "object") {
    return false;
  }

  const fields = payload as Record<string, unknown>;
  const expectedKeys = new Set(["message", "status", "unhandled"]);
  if (!Object.keys(fields).every((key) => expectedKeys.has(key))) {
    return false;
  }

  return (
    fields.unhandled === true &&
    fields.message === "HTTPError" &&
    (fields.status === undefined || fields.status === responseStatus)
  );
}

// Se a resposta do SSR for, na prática, um erro 500 disfarçado de JSON,
// troca pela página de erro personalizada e registra o erro original no log.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isCatastrophicSsrErrorBody(body, response.status)) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return brandedErrorResponse();
}

// Ponto de entrada do servidor (usado pelo Cloudflare Workers / nitro).
// Encaminha a requisição para o handler do TanStack Start e garante que
// qualquer erro — esperado ou não — termine numa página de erro decente,
// além de aplicar os headers de segurança em toda resposta.
export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      const normalized = await normalizeCatastrophicSsrResponse(response);
      return withSecurityHeaders(normalized);
    } catch (error) {
      console.error(error);
      return brandedErrorResponse();
    }
  },
};
