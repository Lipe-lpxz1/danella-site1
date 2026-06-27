import { createStart, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";

// Middleware de servidor que captura qualquer erro não tratado durante
// o processamento de uma requisição. Erros que já têm um "statusCode"
// definido (ex.: 404 de rota não encontrada) são repassados normalmente;
// os demais são registrados no log e respondidos com a página de erro do site.
const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

// Instância principal do TanStack Start, registrando o middleware de erro
// para que ele rode em toda requisição feita ao servidor.
export const startInstance = createStart(() => ({
  requestMiddleware: [errorMiddleware],
}));
