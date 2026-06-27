# Rotas (Routes)

O TanStack Start usa **roteamento baseado em arquivos** (file-based routing).
Cada arquivo `.tsx` dentro desta pasta se torna automaticamente uma página
do site. **Não** crie pastas como `src/pages/`, `src/routes/_app/index.tsx`
ou `app/layout.tsx` — essas são convenções de outros frameworks (Next.js,
Remix), não deste projeto. O único layout "raiz" (que envolve todas as
páginas) é o arquivo `src/routes/__root.tsx`.

## Como nomear os arquivos

| Arquivo | Vira a URL |
| --- | --- |
| `index.tsx` | `/` (página inicial) |
| `sobre.tsx` | `/sobre` |
| `usuarios/index.tsx` | `/usuarios` |
| `usuarios/$id.tsx` | `/usuarios/:id` (parte dinâmica da URL — usa `$`, sem chaves) |
| `posts/{-$categoria}.tsx` | `/posts/:categoria?` (parte opcional da URL) |
| `arquivos/$.tsx` | `/arquivos/*` (captura qualquer coisa depois — lido via parâmetro `_splat`) |
| `_layout.tsx` | rota de layout (renderiza as páginas filhas através de `<Outlet />`) |
| `__root.tsx` | estrutura que envolve TODAS as páginas do site; nunca remova o `<Outlet />` dele |

**Resumindo, para criar uma página nova:** basta criar um arquivo `.tsx`
dentro desta pasta com o nome da URL desejada (ex.: `precos.tsx` vira
`/precos`), seguindo o padrão dos arquivos já existentes (como
`sobre.tsx` ou `contato.tsx`).

`routeTree.gen.ts` é **gerado automaticamente** com base nos arquivos
desta pasta. Não edite esse arquivo manualmente — qualquer alteração
nele será sobrescrita.
