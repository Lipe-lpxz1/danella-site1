import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { SectionLabel } from "@/components/SectionLabel";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato & Contratação — Danella" },
      { name: "description", content: "Formulário de contratação e contatos da equipe." },
      { property: "og:title", content: "Contato — Danella" },
      { property: "og:description", content: "Booking, imprensa e parcerias." },
      { property: "og:url", content: "/contato" },
    ],
    links: [{ rel: "canonical", href: "/contato" }],
  }),
  component: ContatoPage,
});

function ContatoPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Não foi possível enviar a mensagem.");
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="px-6 pt-40 pb-32 md:px-10 md:pt-48">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-20">
        <div className="animate-fade-up lg:col-span-5">
          <SectionLabel index="06">Contato</SectionLabel>
          <h1 className="mt-6 font-display title-fluid text-balance">
            Vamos criar algo <em>memorável</em>.
          </h1>
          <p className="mt-8 max-w-md leading-relaxed text-brand-light/65">
            Para shows, festivais, imprensa e parcerias — entre em contato. Respondemos em até 48
            horas.
          </p>

          <dl className="mt-12 space-y-8">
            <div>
              <dt className="text-[10px] uppercase tracking-luxury text-brand-accent">Booking</dt>
              <dd className="mt-2 font-display text-2xl">
                <a
                  href="mailto:Danielaribeirocontato@hotmail.com"
                  className="hover:text-brand-accent break-all"
                >
                  Danielaribeirocontato@hotmail.com
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-luxury text-brand-accent">Telefone</dt>
              <dd className="mt-2 font-display text-2xl">
                <a
                  href="https://wa.me/5511988377539"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-brand-accent"
                >
                  (11) 98837-7539
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-luxury text-brand-accent">Instagram</dt>
              <dd className="mt-2 font-display text-2xl">
                <a
                  href="https://www.instagram.com/danellaoficial/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-brand-accent"
                >
                  @danellaoficial
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 lg:col-span-6 lg:col-start-7">
          <div className="grid grid-cols-2 gap-4 md:gap-8">
            <Field label="Nome">
              <input name="name" type="text" autoComplete="name" required maxLength={120} className={inputCls} />
            </Field>
            <Field label="Empresa / Veículo">
              <input name="company" type="text" maxLength={160} className={inputCls} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4 md:gap-8">
            <Field label="E-mail">
              <input name="email" type="email" autoComplete="email" required maxLength={254} className={inputCls} />
            </Field>
            <Field label="Telefone">
              <input name="phone" type="tel" autoComplete="tel" maxLength={40} className={inputCls} />
            </Field>
          </div>
          <Field label="Tipo de evento">
            <select
              name="eventType"
              className={inputCls + " appearance-none [&>option]:text-black [&>option]:bg-white"}
              defaultValue=""
            >
              <option value="" disabled>Selecione</option>
              <option>Show / Festival</option>
              <option>Imprensa</option>
              <option>Parceria</option>
              <option>Outro</option>
            </select>
          </Field>
          <Field label="Mensagem">
            <textarea name="message" rows={5} required maxLength={5000} className={inputCls + " resize-none"} />
          </Field>

          <button
            type="submit"
            disabled={status === "sending" || status === "sent"}
            className="min-h-12 w-full bg-brand-light px-6 py-5 text-center text-[10px] font-semibold uppercase tracking-luxury text-brand-dark transition-colors hover:bg-brand-accent disabled:opacity-60 sm:px-8"
          >
            {status === "sending"
              ? "Enviando…"
              : status === "sent"
                ? "Mensagem enviada — obrigada"
                : "Enviar solicitação"}
          </button>
          <p aria-live="polite" className="text-sm text-brand-light/70">
            {status === "sent" && "Recebemos sua mensagem e entraremos em contato."}
            {status === "error" && "Não foi possível enviar agora. Tente novamente ou fale conosco pelo WhatsApp."}
          </p>

          <a
            href="https://wa.me/5511988377539"
            target="_blank"
            rel="noreferrer"
            className="flex min-h-12 w-full items-center justify-center border border-brand-light/30 px-6 py-5 text-center text-[10px] font-semibold uppercase tracking-luxury text-brand-light transition-colors hover:border-brand-accent hover:text-brand-accent sm:px-8"
          >
            WhatsApp
          </a>
        </form>
      </div>
    </section>
  );
}

const inputCls =
  "w-full border-b border-border bg-transparent py-3 text-base text-brand-light outline-none transition-colors focus:border-brand-accent";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="text-[10px] uppercase tracking-luxury text-brand-light/50">{label}</span>
      {children}
    </label>
  );
}
