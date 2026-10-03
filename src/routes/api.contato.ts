import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

type ContactSubmission = {
  name?: unknown;
  company?: unknown;
  email?: unknown;
  phone?: unknown;
  eventType?: unknown;
  message?: unknown;
};

function clean(value: unknown, maxLength: number): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export const Route = createFileRoute("/api/contato")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!request.headers.get("content-type")?.includes("application/json")) {
          return Response.json({ error: "Formato inválido." }, { status: 415 });
        }

        let body: ContactSubmission;
        try {
          body = (await request.json()) as ContactSubmission;
        } catch {
          return Response.json({ error: "Mensagem inválida." }, { status: 400 });
        }

        const name = clean(body.name, 120);
        const company = clean(body.company, 160);
        const email = clean(body.email, 254);
        const phone = clean(body.phone, 40);
        const eventType = clean(body.eventType, 80);
        const message = clean(body.message, 5000);

        if (
          !name ||
          !message ||
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
          message.length > 5000
        ) {
          return Response.json({ error: "Confira os campos do formulário." }, { status: 400 });
        }

        const apiKey = process.env.RESEND_API_KEY;
        const from = process.env.CONTACT_FROM_EMAIL;
        const to = process.env.CONTACT_TO_EMAIL ?? "Danielaribeirocontato@hotmail.com";
        if (!apiKey || !from) {
          console.error("Contato não configurado: defina RESEND_API_KEY e CONTACT_FROM_EMAIL.");
          return Response.json({ error: "Envio de e-mail ainda não configurado." }, { status: 503 });
        }

        const lines = [
          `Nome: ${name}`,
          `E-mail: ${email}`,
          `Empresa / veículo: ${company || "Não informado"}`,
          `Telefone: ${phone || "Não informado"}`,
          `Tipo de evento: ${eventType || "Não informado"}`,
          "",
          "Mensagem:",
          message,
        ];

        try {
          const resendResponse = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from,
              to: [to],
              reply_to: email,
              subject: `Contato pelo site — ${name}`,
              text: lines.join("\n"),
            }),
          });

          if (!resendResponse.ok) {
            const details = await resendResponse.text();
            console.error("Resend recusou o e-mail de contato:", resendResponse.status, details);
            return Response.json({ error: "O provedor não aceitou o e-mail." }, { status: 502 });
          }

          return Response.json({ ok: true }, { status: 200 });
        } catch (error) {
          console.error("Falha ao enviar e-mail de contato:", error);
          return Response.json({ error: "Falha temporária no envio." }, { status: 502 });
        }
      },
    },
  },
});
