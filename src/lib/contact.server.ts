export type ContactSubmission = {
  name: string;
  company: string;
  email: string;
  telephone: string;
  eventType: string;
  message: string;
  website: string;
};

const EVENT_TYPES = new Set(["Show / Festival", "Imprensa", "Parceria"]);

function readText(value: unknown, maxLength: number): string {
  if (typeof value !== "string") throw new Error("Confira os dados do formulário.");
  const normalized = value.trim().replace(/\r\n?/g, "\n");
  if (normalized.length > maxLength) throw new Error("Confira os dados do formulário.");
  return normalized;
}

export function validateContactSubmission(input: unknown): ContactSubmission {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new Error("Confira os dados do formulário.");
  }

  const values = input as Record<string, unknown>;
  const submission: ContactSubmission = {
    name: readText(values.name, 120),
    company: readText(values.company, 160),
    email: readText(values.email, 254).toLowerCase(),
    telephone: readText(values.telephone, 50),
    eventType: readText(values.eventType, 40),
    message: readText(values.message, 5000),
    website: readText(values.website, 200),
  };

  if (
    !submission.name ||
    !submission.message ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(submission.email) ||
    (submission.eventType !== "" && !EVENT_TYPES.has(submission.eventType))
  ) {
    throw new Error("Confira os dados do formulário.");
  }

  return submission;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

export async function sendContactWithResend(
  submission: ContactSubmission,
  env: Record<string, string | undefined> = process.env,
  fetcher: typeof fetch = fetch,
): Promise<{ ok: true } | { ok: false; message: string }> {
  // Honeypot: reject automated submissions without contacting the provider.
  if (submission.website)
    return { ok: false, message: "Não foi possível enviar. Confira os dados e tente novamente." };

  const apiKey = env.RESEND_API_KEY?.trim();
  const from = env.RESEND_FROM?.trim();
  const to = env.RESEND_TO?.trim();
  if (!apiKey || !from || !to) {
    return {
      ok: false,
      message: "O formulário está temporariamente indisponível. Tente novamente mais tarde.",
    };
  }

  const plainText = [
    "Nova solicitação pelo formulário de contato da Danella",
    "",
    `Nome: ${submission.name}`,
    `Empresa / Veículo: ${submission.company || "Não informado"}`,
    `E-mail: ${submission.email}`,
    `Telefone: ${submission.telephone || "Não informado"}`,
    `Tipo de evento: ${submission.eventType || "Não informado"}`,
    "",
    "Mensagem:",
    submission.message,
  ].join("\n");

  const html = `<!doctype html><html lang="pt-BR"><body style="margin:0;background:#f5f2ed;color:#211b18;font-family:Arial,sans-serif"><main style="max-width:620px;margin:32px auto;padding:32px;background:#fff"><p style="margin:0 0 24px;color:#936a4a;font-size:12px;letter-spacing:2px;text-transform:uppercase">Danella · Contato</p><h1 style="margin:0 0 24px;font-size:24px">Nova solicitação</h1><table style="width:100%;border-collapse:collapse"><tbody>${[
    ["Nome", submission.name],
    ["Empresa / Veículo", submission.company || "Não informado"],
    ["E-mail", submission.email],
    ["Telefone", submission.telephone || "Não informado"],
    ["Tipo de evento", submission.eventType || "Não informado"],
  ]
    .map(
      ([label, value]) =>
        `<tr><th style="padding:10px 12px;border-bottom:1px solid #e8e2dc;text-align:left;font-size:13px">${escapeHtml(label)}</th><td style="padding:10px 12px;border-bottom:1px solid #e8e2dc;font-size:14px">${escapeHtml(value)}</td></tr>`,
    )
    .join(
      "",
    )}</tbody></table><h2 style="margin:28px 0 10px;font-size:16px">Mensagem</h2><p style="margin:0;line-height:1.7;white-space:pre-wrap">${escapeHtml(submission.message)}</p><p style="margin:28px 0 0;font-size:12px;color:#736b65">Responder para: <a href="mailto:${escapeHtml(submission.email)}">${escapeHtml(submission.email)}</a></p></main></body></html>`;

  try {
    const response = await fetcher("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: submission.email,
        subject: `Contato Danella — ${submission.name}`,
        text: plainText,
        html,
      }),
      signal: AbortSignal.timeout(12_000),
    });

    if (!response.ok) {
      return {
        ok: false,
        message: "Não foi possível enviar sua mensagem agora. Tente novamente em alguns instantes.",
      };
    }

    const result: unknown = await response.json();
    if (
      !result ||
      typeof result !== "object" ||
      typeof (result as { id?: unknown }).id !== "string" ||
      !(result as { id: string }).id
    ) {
      return { ok: false, message: "Não foi possível confirmar o envio. Tente novamente." };
    }

    return { ok: true };
  } catch {
    return {
      ok: false,
      message: "Falha de conexão ao enviar. Verifique sua conexão e tente novamente.",
    };
  }
}
