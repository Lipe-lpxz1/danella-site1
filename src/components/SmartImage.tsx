import { useEffect, useRef, useState, type ImgHTMLAttributes } from "react";

type SmartImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  // Cor/classe de fundo mostrada enquanto a imagem ainda não carregou.
  placeholderClassName?: string;
  // Duração (em ms) da transição de opacidade ao revelar a imagem.
  fadeMs?: number;
};

// Componente de imagem que evita o "flash" feio de imagem quebrada/vazia:
// mostra uma cor de fundo (placeholder) e só revela a imagem com um fade
// suave depois que ela termina de carregar e decodificar de verdade.
export function SmartImage({
  placeholderClassName = "bg-brand-muted",
  fadeMs = 350,
  className = "",
  loading = "lazy",
  decoding = "async",
  onLoad,
  style,
  ...rest
}: SmartImageProps) {
  const ref = useRef<HTMLImageElement | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Caso a imagem já esteja no cache do navegador e carregue
  // instantaneamente, o evento "onLoad" pode não disparar — então
  // checamos manualmente se ela já está completa ao montar o componente.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (el.complete && el.naturalWidth > 0) {
      reveal(el);
    }
  }, []);

  // Marca a imagem como "carregada" somente após o navegador finalizar
  // a decodificação (evita revelar uma imagem que ainda vai "piscar").
  const reveal = (el: HTMLImageElement) => {
    const done = () => setLoaded(true);
    if (typeof el.decode === "function") {
      el.decode().then(done).catch(done);
    } else {
      done();
    }
  };

  return (
    <img
      ref={ref}
      {...rest}
      loading={loading}
      decoding={decoding}
      onLoad={(e) => {
        reveal(e.currentTarget);
        onLoad?.(e);
      }}
      className={`${placeholderClassName} ${className}`}
      style={{
        ...style,
        opacity: loaded ? 1 : 0,
        transition: `opacity ${fadeMs}ms ease-out`,
      }}
    />
  );
}
