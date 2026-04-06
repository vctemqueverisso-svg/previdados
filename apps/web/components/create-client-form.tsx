"use client";

import { useState } from "react";
import { Client } from "../lib/types";
import { getClientApiBaseUrl } from "../lib/client-api";
import { normalizeMultilineText, normalizeSingleLineText } from "./utils";

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

  function updateField<K extends keyof ClientFormState>(field: K, value: string, multiline = false) {
    setForm((current) => ({
      ...current,
      [field]: multiline ? normalizeMultilineText(value) : normalizeSingleLineText(value)
    }));
  }

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
      body: JSON.stringify({
        ...form,
        fullName: normalizeSingleLineText(form.fullName),
        cpf: normalizeSingleLineText(form.cpf),
        phone: normalizeSingleLineText(form.phone),
        email: normalizeSingleLineText(form.email),
        zipCode: normalizeSingleLineText(form.zipCode),
        street: normalizeSingleLineText(form.street),
        addressNumber: normalizeSingleLineText(form.addressNumber),
        neighborhood: normalizeSingleLineText(form.neighborhood),
        complement: normalizeSingleLineText(form.complement),
        city: normalizeSingleLineText(form.city),
        state: normalizeSingleLineText(form.state),
        notes: normalizeMultilineText(form.notes)
      })
    });

    if (!response.ok) {
      setLoading(false);
      setError(mode === "edit" ? "Não foi possível atualizar o cliente." : "Não foi possível cadastrar o cliente.");
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
      <input placeholder="Nome completo" value={form.fullName} onChange={(e) => updateField("fullName", e.target.value)} required />
      <input placeholder="CPF" value={form.cpf} onChange={(e) => updateField("cpf", e.target.value)} required />
      <input type="date" value={form.birthDate} onChange={(e) => setForm({ ...form, birthDate: e.target.value })} required />
      <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
        <option value="NAO_INFORMADO">Gênero</option>
        <option value="FEMININO">Feminino</option>
        <option value="MASCULINO">Masculino</option>
        <option value="OUTRO">Outro</option>
      </select>
      <input placeholder="Telefone" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} />
      <input placeholder="Email" value={form.email} onChange={(e) => updateField("email", e.target.value)} />
      <input placeholder="CEP" value={form.zipCode} onChange={(e) => updateField("zipCode", e.target.value)} />
      <input className="md:col-span-2" placeholder="Logradouro" value={form.street} onChange={(e) => updateField("street", e.target.value)} />
      <input placeholder="Número" value={form.addressNumber} onChange={(e) => updateField("addressNumber", e.target.value)} />
      <input placeholder="Bairro" value={form.neighborhood} onChange={(e) => updateField("neighborhood", e.target.value)} />
      <input className="md:col-span-2" placeholder="Complemento" value={form.complement} onChange={(e) => updateField("complement", e.target.value)} />
      <input placeholder="Cidade" value={form.city} onChange={(e) => updateField("city", e.target.value)} />
      <input placeholder="UF" value={form.state} onChange={(e) => updateField("state", e.target.value)} />
      <textarea className="md:col-span-2" placeholder="Observações" value={form.notes} onChange={(e) => updateField("notes", e.target.value, true)} />
      {error ? <p className="md:col-span-2 text-sm text-red-600">{error}</p> : null}
      <div className="md:col-span-2 flex flex-wrap gap-3">
        <button className="rounded-xl bg-ink px-4 py-3 text-sm font-medium text-white hover:bg-ink/90" disabled={loading}>
          {loading ? "Salvando..." : mode === "edit" ? "Salvar alterações" : "Cadastrar cliente"}
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
