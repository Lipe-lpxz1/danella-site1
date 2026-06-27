// Pequeno rótulo usado no topo de cada seção das páginas (ex: "04 — Discografia").
// Mostra um número/índice opcional, um tracinho decorativo e o texto da seção.
export function SectionLabel({ index, children }: { index?: string; children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-3 text-[10px] uppercase tracking-luxury text-brand-accent">
      {index ? <span className="text-brand-light/30">{index}</span> : null}
      <span className="h-px w-8 bg-brand-accent/60" />
      {children}
    </p>
  );
}
