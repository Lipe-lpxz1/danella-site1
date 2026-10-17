import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { SectionLabel } from "@/components/SectionLabel";
import { sendContactMessage } from "@/lib/contact.functions";

// Registra a rota "/contato" e seus metadados.
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
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const submitting = useRef(false);

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

          {/* Canais de contato diretos, sem precisar passar pelo formulário */}
          <dl className="mt-12 space-y-8">
            <div>
              <dt className="text-[10px] uppercase tracking-luxury text-brand-accent">Booking</dt>
              <dd className="mobile-booking-email mt-2 font-display text-2xl">
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

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (submitting.current || sent) return;

            const formData = new FormData(e.currentTarget);
            const data = {
              name: String(formData.get("name") ?? ""),
              company: String(formData.get("company") ?? ""),
              email: String(formData.get("email") ?? ""),
              telephone: String(formData.get("telephone") ?? ""),
              eventType: String(formData.get("eventType") ?? ""),
              message: String(formData.get("message") ?? ""),
              website: String(formData.get("website") ?? ""),
            };

            submitting.current = true;
            setSending(true);
            setError("");
            try {
              const result = await sendContactMessage({ data });
              if (!result.ok) {
                setError(result.message);
                return;
              }
              setSent(true);
            } catch {
              setError(
                "Não foi possível enviar sua mensagem agora. Confira os dados e tente novamente.",
              );
            } finally {
              submitting.current = false;
              setSending(false);
            }
          }}
          className="contact-form space-y-8 lg:col-span-6 lg:col-start-7"
        >
          <div className="contact-field-pair grid grid-cols-2 gap-4 md:gap-8">
            <Field label="Nome">
              <input name="name" type="text" autoComplete="name" required className={inputCls} />
            </Field>
            <Field label="Empresa / Veículo">
              <input name="company" type="text" autoComplete="organization" className={inputCls} />
            </Field>
          </div>
          <div className="contact-field-pair grid grid-cols-2 gap-4 md:gap-8">
            <Field label="E-mail">
              <input name="email" type="email" autoComplete="email" required className={inputCls} />
            </Field>
            <Field label="Telefone">
              <input name="telephone" type="tel" autoComplete="tel" className={inputCls} />
            </Field>
          </div>
          <Field label="Tipo de evento">
            <select
              className={inputCls + " appearance-none [&>option]:text-black [&>option]:bg-white"}
              defaultValue=""
              name="eventType"
            >
              <option value="" disabled>
                Selecione
              </option>
              <option>Show / Festival</option>
              <option>Imprensa</option>
              <option>Parceria</option>
            </select>
          </Field>
          <Field label="Mensagem">
            <textarea name="message" rows={5} required className={inputCls + " resize-none"} />
          </Field>

          <div
            aria-hidden="true"
            className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden"
          >
            <label>
              Não preencha este campo
              <input name="website" type="text" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          {error && (
            <p role="alert" aria-live="polite" className="text-sm text-brand-accent">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={sending || sent}
            className="min-h-12 w-full bg-brand-light px-6 py-5 text-center text-[10px] font-semibold uppercase tracking-luxury text-brand-dark transition-colors hover:bg-brand-accent disabled:opacity-60 sm:px-8"
          >
            {sent ? "Mensagem enviada — obrigada" : sending ? "Enviando…" : "Enviar solicitação"}
          </button>

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

// Estilo compartilhado por todos os campos de texto/seleção do formulário.
const inputCls =
  "w-full border-b border-border bg-transparent py-3 text-base text-brand-light outline-none transition-colors focus:border-brand-accent";

// Envolve um campo do formulário com seu rótulo (label) acima, no
// mesmo estilo visual usado em todo o formulário de contato.
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="text-[10px] uppercase tracking-luxury text-brand-light/50">{label}</span>
      {children}
    </label>
  );
}
