"use client";

import { useState } from "react";
import { getClientApiBaseUrl } from "../lib/client-api";

function getTokenFromCookie() {
  const value = document.cookie
    .split("; ")
    .find((item) => item.startsWith("token="))
    ?.split("=")[1];
  return value ?? "";
}

export function CreateExpertForm() {
  const [form, setForm] = useState({
    fullName: "",
    specialty: "",
    registryNumber: "",
    city: "",
    state: "",
    internalNotes: ""
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await fetch(`${getClientApiBaseUrl()}/api/experts`, {
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
      <input placeholder="Nome do perito" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
      <input placeholder="Especialidade" value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} />
      <input placeholder="Registro" value={form.registryNumber} onChange={(e) => setForm({ ...form, registryNumber: e.target.value })} />
      <input placeholder="Cidade" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
      <input placeholder="UF" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
      <textarea placeholder="Observações internas" className="md:col-span-2" value={form.internalNotes} onChange={(e) => setForm({ ...form, internalNotes: e.target.value })} />
      <button className="rounded-xl bg-ink px-4 py-3 text-sm font-medium text-white hover:bg-ink/90">Cadastrar perito</button>
    </form>
  );
}
