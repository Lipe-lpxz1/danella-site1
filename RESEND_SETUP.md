# Configuração do envio de contato (Resend)

O formulário envia os dados atuais para uma função server-side TanStack Start. A função faz um `POST` para a API de e-mails do Resend; a interface só confirma quando a API responde com sucesso e um ID de mensagem. A chave nunca é enviada ao navegador.

## Desenvolvimento local

1. Revogue e substitua qualquer chave que tenha sido compartilhada em chat, issue ou outro canal público.
2. No Resend, adicione o domínio que você controla em **Domains** e publique os registros DNS indicados até o domínio ficar verificado.
3. Crie uma API key com permissão **Sending access**, restrita ao domínio verificado.
4. Copie `.env.example` para `.env.local` na raiz do projeto e preencha:
   - `RESEND_API_KEY`: a nova chave de envio do Resend.
   - `RESEND_FROM`: nome e endereço sob o domínio verificado, por exemplo `Danella <contato@seudominio.com>`. O domínio/endereço precisa estar autorizado no Resend; escolha o endereço real que deseja usar.
   - `RESEND_TO`: e-mail que receberá as solicitações. O valor em `.env.example` é fictício; configure o e-mail de booking que já aparece na página de Contato (`Danielaribeirocontato@hotmail.com`) ou o endereço correto para receber os contatos.
5. Reinicie `npm run dev` depois de salvar `.env.local`.

Não use `VITE_` nos nomes. `.env.local` está ignorado pelo Git.

## Netlify

No site correto do Netlify, abra **Site configuration → Environment variables** e crie as mesmas três variáveis (`RESEND_API_KEY`, `RESEND_FROM`, `RESEND_TO`) para os contextos de deploy necessários. Marque a chave como secreta/restrita quando essa opção estiver disponível. Depois, faça um deploy pelo fluxo normal do projeto para que o runtime receba as variáveis.

## Teste real de envio

Com o domínio verificado e as variáveis configuradas, inicie o app local, abra `/contato`, preencha o formulário e envie uma mensagem de teste que você espera receber no endereço `RESEND_TO`. Sucesso na página significa que a API aceitou a mensagem; confirme a entrega no painel **Emails** do Resend e na caixa de entrada. Os testes automatizados de validação não enviam e-mail.

## Proteção contra abuso

O formulário valida e limita os campos no servidor, usa um honeypot e bloqueia submissões repetidas enquanto a solicitação está em andamento. O app não possui armazenamento/infraestrutura de rate limit persistente por IP; um limite distribuído de requisições exigiria serviço externo ou infraestrutura adicional e não foi simulado em memória.
