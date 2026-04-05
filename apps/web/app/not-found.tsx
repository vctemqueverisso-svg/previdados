export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="card max-w-xl px-8 py-10 text-center">
        <p className="eyebrow">Navegacao</p>
        <h1 className="mt-3 text-4xl font-semibold text-ink">Pagina nao encontrada</h1>
        <p className="mt-4 text-sm text-[color:var(--text-soft)]">
          O endereco informado nao corresponde a uma tela ativa do PreviDados.
        </p>
      </div>
    </div>
  );
}
