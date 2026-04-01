"use client";

import { useState } from "react";

function getTokenFromCookie() {
  const value = document.cookie
    .split("; ")
    .find((item) => item.startsWith("token="))
    ?.split("=")[1];
  return value ?? "";
}

const initialState = {
  fullName: "",
  cpf: "",
  birthDate: "",
  gender: "NAO_INFORMADO",
  phone: "",
  email: "",
  city: "",
  state: "",
  notes: ""
};

export function CreateClientForm() {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/clients`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getTokenFromCookie()}`
      },
      body: JSON.stringify(form)
    });

    window.location.reload();
  }

  return (
    <form onSubmit={handleSubmit} className="card grid gap-3 p-5 md:grid-cols-2">
      <input placeholder="Nome completo" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
      <input placeholder="CPF" value={form.cpf} onChange={(e) => setForm({ ...form, cpf: e.target.value })} required />
      <input type="date" value={form.birthDate} onChange={(e) => setForm({ ...form, birthDate: e.target.value })} required />
      <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
        <option value="NAO_INFORMADO">Genero</option>
        <option value="FEMININO">Feminino</option>
        <option value="MASCULINO">Masculino</option>
        <option value="OUTRO">Outro</option>
      </select>
      <input placeholder="Telefone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input placeholder="Cidade" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
      <input placeholder="UF" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
      <textarea className="md:col-span-2" placeholder="Observacoes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
      <button className="rounded-xl bg-ink px-4 py-3 text-sm font-medium text-white hover:bg-ink/90" disabled={loading}>
        {loading ? "Salvando..." : "Cadastrar cliente"}
      </button>
    </form>
  );
}

