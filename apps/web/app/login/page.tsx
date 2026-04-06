"use client";

import { FormEvent, useState } from "react";

const apiUrl = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333").replace(/\/+$/, "");

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");

    try {
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error("Não foi possível entrar. Verifique email e senha.");
      }

      const data = (await response.json()) as { accessToken: string };
      document.cookie = `token=${data.accessToken}; path=/; SameSite=Lax`;
      window.location.href = "/";
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Falha ao entrar.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_#f8f5ef,_#e7d8c9,_#d4c1ac)] p-6">
      <div className="w-full max-w-md rounded-3xl border border-white/50 bg-white/80 p-8 shadow-soft backdrop-blur">
        <p className="text-xs uppercase tracking-[0.3em] text-moss">Acesso seguro</p>
        <h1 className="mt-3 text-3xl font-semibold text-ink">Entrar no PreviDados</h1>
        <p className="mt-3 text-sm text-stone-600">
          Ambiente preparado para dados sensíveis previdenciários, histórico processual e inteligência estatística.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input className="w-full" type="email" name="email" placeholder="Email" required />
          <input className="w-full" type="password" name="password" placeholder="Senha" required />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-ink px-4 py-3 text-sm font-medium text-white hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        {error ? <p className="mt-4 rounded-2xl bg-[#fff1f1] px-4 py-3 text-sm text-[#8c2a2a]">{error}</p> : null}
      </div>
    </div>
  );
}
