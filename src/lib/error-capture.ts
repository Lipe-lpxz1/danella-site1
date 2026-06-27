// Guarda o último erro não tratado capturado globalmente, junto com o
// momento em que ocorreu. Serve para o server.ts conseguir recuperar
// o erro "real" quando o SSR devolve um erro 500 genérico sem detalhes.
let lastCapturedError: { error: unknown; at: number } | undefined;

// Tempo máximo (em milissegundos) que um erro capturado fica válido.
// Depois disso, é descartado para não usar informação desatualizada.
const TTL_MS = 5_000;

function record(error: unknown) {
  lastCapturedError = { error, at: Date.now() };
}

// Escuta erros globais (erros não tratados e promises rejeitadas sem catch)
// para guardar o motivo real de uma falha antes que ela seja "engolida".
if (typeof globalThis.addEventListener === "function") {
  globalThis.addEventListener("error", (event) => record((event as ErrorEvent).error ?? event));
  globalThis.addEventListener("unhandledrejection", (event) =>
    record((event as PromiseRejectionEvent).reason),
  );
}

// Retorna o último erro capturado, desde que ainda esteja dentro do prazo
// de validade (TTL_MS). Ao ser consumido, o erro é descartado da memória.
export function consumeLastCapturedError(): unknown {
  if (!lastCapturedError) return undefined;
  if (Date.now() - lastCapturedError.at > TTL_MS) {
    lastCapturedError = undefined;
    return undefined;
  }
  const { error } = lastCapturedError;
  lastCapturedError = undefined;
  return error;
}
