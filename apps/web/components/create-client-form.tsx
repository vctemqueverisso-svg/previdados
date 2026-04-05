"use client";

import { useState } from "react";
import { Client } from "../lib/types";
import { getClientApiBaseUrl } from "../lib/client-api";

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
  zipCode: "",
  street: "",
  addressNumber: "",
  neighborhood: "",
  complement: "",
  city: "",
  state: "",
  notes: ""
};

type ClientFormState = typeof initialState;

type CreateClientFormProps = {
  mode?: "create" | "edit";
  clientId?: string;
  initialValues?: Partial<Client>;
  onSaved?: (client: Client) => void;
  onCancel?: () => void;
};

function buildInitialState(initialValues?: Partial<Client>): ClientFormState {
  return {
    ...initialState,
    ...initialValues,
    birthDate: initialValues?.birthDate ? String(initialValues.birthDate).slice(0, 10) : ""
  };
}

export function CreateClientForm({
  mode = "create",
  clientId,
  initialValues,
  onSaved,
  onCancel
}: CreateClientFormProps) {
  const [form, setForm] = useState<ClientFormState>(() => buildInitialState(initialValues));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch(`${getClientApiBaseUrl()}/api/clients${mode === "edit" && clientId ? `/${clientId}` : ""}`, {
      method: mode === "edit" ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getTokenFromCookie()}`
      },
      body: JSON.stringify(form)
    });

    if (!response.ok) {
      setLoading(false);
      setError(mode === "edit" ? "Nao foi possivel atualizar o cliente." : "Nao foi possivel cadastrar o cliente.");
      return;
    }

    const savedClient = (await response.json()) as Client;

    if (mode === "create") {
      setForm(initialState);
    }

    setLoading(false);
    onSaved?.(savedClient);
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
      <input placeholder="CEP" value={form.zipCode} onChange={(e) => setForm({ ...form, zipCode: e.target.value })} />
      <input className="md:col-span-2" placeholder="Logradouro" value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} />
      <input placeholder="Numero" value={form.addressNumber} onChange={(e) => setForm({ ...form, addressNumber: e.target.value })} />
      <input placeholder="Bairro" value={form.neighborhood} onChange={(e) => setForm({ ...form, neighborhood: e.target.value })} />
      <input className="md:col-span-2" placeholder="Complemento" value={form.complement} onChange={(e) => setForm({ ...form, complement: e.target.value })} />
      <input placeholder="Cidade" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
      <input placeholder="UF" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
      <textarea className="md:col-span-2" placeholder="Observacoes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
      {error ? <p className="md:col-span-2 text-sm text-red-600">{error}</p> : null}
      <div className="md:col-span-2 flex flex-wrap gap-3">
        <button className="rounded-xl bg-ink px-4 py-3 text-sm font-medium text-white hover:bg-ink/90" disabled={loading}>
          {loading ? "Salvando..." : mode === "edit" ? "Salvar alteracoes" : "Cadastrar cliente"}
        </button>
        {mode === "edit" && onCancel ? (
          <button
            type="button"
            className="rounded-xl border border-[rgba(24,38,63,0.12)] bg-white px-4 py-3 text-sm font-medium text-ink hover:bg-slate-50"
            onClick={onCancel}
          >
            Cancelar
          </button>
        ) : null}
      </div>
    </form>
  );
}
