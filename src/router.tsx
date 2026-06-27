import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

// Cria e configura o roteador da aplicação (TanStack Router).
// É chamado tanto no servidor (SSR) quanto no navegador, por isso
// uma nova instância de QueryClient é criada a cada chamada.
export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    // Mantém a posição de scroll ao navegar entre páginas (voltar/avançar).
    scrollRestoration: true,
    // Pré-carrega os dados da rota assim que o link aparece na tela.
    defaultPreload: "render",
    // Sempre considera os dados pré-carregados como "velhos",
    // forçando uma nova busca ao navegar de fato.
    defaultPreloadStaleTime: 0,
  });

  return router;
};
