import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv, type ConfigEnv, type UserConfig } from "vite";

const projectRoot = dirname(fileURLToPath(import.meta.url));

// Esta configuração vem do pacote @lovable.dev/vite-tanstack-config, que
// faz por baixo dos panos toda a configuração padrão do Vite + TanStack
// Start usada por este projeto (plugins, fontes, build, etc). Não foi
// possível remover essa dependência sem reescrever manualmente toda essa
// configuração de build.
//
// Por baixo dos panos, esse pacote usa o Nitro (o "motor" de servidor do
// TanStack Start) para gerar a versão final do site, no formato exigido
// pela plataforma de hospedagem escolhida — isso é o que a opção
// `nitro.preset` abaixo controla.
//
// Redireciona o ponto de entrada do servidor do TanStack Start para
// src/server.ts (nosso wrapper de SSR com tratamento de erros).
const lovableConfig = defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  // Preset "netlify": faz o Nitro empacotar o servidor no formato de
  // Netlify Functions, em vez do formato de Cloudflare Workers usado
  // antes. Sem isso, o site builda mas o Netlify não sabe rodar as
  // páginas (gera erro 404 ao navegar para qualquer rota).
  // Caso este projeto volte a ser hospedado na Cloudflare no futuro,
  // troque o valor abaixo para "cloudflare-module".
  nitro: {
    preset: "netlify",
  },
});

// Vite keeps unprefixed variables out of import.meta.env. Load only the
// server-side Resend settings into the local Node process for server handlers.
export default async function configure(env: ConfigEnv): Promise<UserConfig> {
  const localEnv = loadEnv(env.mode, projectRoot, "");
  for (const name of ["RESEND_API_KEY", "RESEND_FROM", "RESEND_TO"]) {
    if (!process.env[name] && localEnv[name]) process.env[name] = localEnv[name];
  }
  return lovableConfig(env);
}
