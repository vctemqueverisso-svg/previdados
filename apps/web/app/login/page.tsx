import { loginAction } from "./actions";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_#f8f5ef,_#e7d8c9,_#d4c1ac)] p-6">
      <div className="w-full max-w-md rounded-3xl border border-white/50 bg-white/80 p-8 shadow-soft backdrop-blur">
        <p className="text-xs uppercase tracking-[0.3em] text-moss">Acesso seguro</p>
        <h1 className="mt-3 text-3xl font-semibold text-ink">Entrar no PreviDados</h1>
        <p className="mt-3 text-sm text-stone-600">
          Ambiente preparado para dados sensiveis previdenciarios, historico processual e inteligencia estatistica.
        </p>

        <form action={loginAction} className="mt-6 space-y-4">
          <input className="w-full" type="email" name="email" placeholder="Email" required />
          <input className="w-full" type="password" name="password" placeholder="Senha" required />
          <button className="w-full rounded-xl bg-ink px-4 py-3 text-sm font-medium text-white hover:bg-ink/90">
            Entrar
          </button>
        </form>

        <div className="mt-6 rounded-2xl bg-sand p-4 text-sm text-stone-600">
          Usuario seed: <strong>admin@jcprevdados.local</strong>
          <br />
          Senha seed: <strong>admin123</strong>
        </div>
      </div>
    </div>
  );
}
