# Configuração do formulário de contato

O formulário envia as mensagens pelo backend do Netlify usando a API do Resend. As credenciais ficam no servidor e não são incluídas no JavaScript público.

## Configurar no Netlify

1. Crie uma conta no Resend e gere uma API key.
2. Verifique no Resend o domínio que será usado como remetente. O endereço remetente precisa pertencer a esse domínio verificado.
3. No painel do site no Netlify, abra **Site configuration → Environment variables** e adicione:
   - `RESEND_API_KEY`: a API key criada no Resend.
   - `CONTACT_FROM_EMAIL`: remetente verificado, por exemplo `Site Danella <site@seudominio.com.br>`.
   - `CONTACT_TO_EMAIL`: endereço que receberá as mensagens. Se omitido, usa `Danielaribeirocontato@hotmail.com`.
4. Faça um novo deploy para aplicar as variáveis.
5. Envie uma mensagem de teste pela página `/contato` e confirme o recebimento.

Sem `RESEND_API_KEY` ou `CONTACT_FROM_EMAIL`, o endpoint retorna erro e a página não mostra uma confirmação falsa de envio. Não coloque a API key em arquivos `VITE_*`, pois essas variáveis podem ser expostas no navegador.

Para desenvolvimento local, defina as mesmas variáveis no ambiente antes de iniciar o servidor. Não compartilhe nem envie a API key ao repositório.
