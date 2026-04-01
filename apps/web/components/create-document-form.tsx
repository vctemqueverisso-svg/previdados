"use client";

import { useState } from "react";

function getTokenFromCookie() {
  const value = document.cookie
    .split("; ")
    .find((item) => item.startsWith("token="))
    ?.split("=")[1];
  return value ?? "";
}

type Option = { id: string; label: string };

type Props = {
  categories: Option[];
  clients: Option[];
  cases: Option[];
};

export function CreateDocumentForm({ categories, clients, cases }: Props) {
  const [form, setForm] = useState({
    clientId: "",
    caseId: "",
    categoryId: categories[0]?.id ?? "",
    fileName: "",
    originalFileName: "",
    mimeType: "application/pdf",
    storageKey: "",
    fileSize: 0,
    documentDate: "",
    origin: "",
    notes: "",
    extraction: {
      sourceType: "MANUAL",
      finalConclusion: "",
      hasIncapacity: false
    }
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/documents`, {
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
    <form onSubmit={handleSubmit} className="card grid gap-3 p-5 md:grid-cols-3">
      <select value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })}>
        <option value="">Cliente opcional</option>
        {clients.map((item) => (
          <option key={item.id} value={item.id}>{item.label}</option>
        ))}
      </select>
      <select value={form.caseId} onChange={(e) => setForm({ ...form, caseId: e.target.value })}>
        <option value="">Caso opcional</option>
        {cases.map((item) => (
          <option key={item.id} value={item.id}>{item.label}</option>
        ))}
      </select>
      <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
        {categories.map((item) => (
          <option key={item.id} value={item.id}>{item.label}</option>
        ))}
      </select>
      <input placeholder="Nome interno do arquivo" value={form.fileName} onChange={(e) => setForm({ ...form, fileName: e.target.value })} required />
      <input placeholder="Nome original" value={form.originalFileName} onChange={(e) => setForm({ ...form, originalFileName: e.target.value })} required />
      <input placeholder="Storage key" value={form.storageKey} onChange={(e) => setForm({ ...form, storageKey: e.target.value })} required />
      <input placeholder="Mime type" value={form.mimeType} onChange={(e) => setForm({ ...form, mimeType: e.target.value })} />
      <input type="number" placeholder="Tamanho em bytes" value={form.fileSize} onChange={(e) => setForm({ ...form, fileSize: Number(e.target.value) })} />
      <input type="date" value={form.documentDate} onChange={(e) => setForm({ ...form, documentDate: e.target.value })} />
      <input placeholder="Origem" value={form.origin} onChange={(e) => setForm({ ...form, origin: e.target.value })} />
      <textarea className="md:col-span-3" placeholder="Observacoes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
      <textarea className="md:col-span-2" placeholder="Conclusao estruturada" value={form.extraction.finalConclusion} onChange={(e) => setForm({ ...form, extraction: { ...form.extraction, finalConclusion: e.target.value } })} />
      <label className="flex items-center gap-2 text-sm text-stone-600">
        <input type="checkbox" checked={form.extraction.hasIncapacity} onChange={(e) => setForm({ ...form, extraction: { ...form.extraction, hasIncapacity: e.target.checked } })} />
        Documento reconhece incapacidade
      </label>
      <button className="rounded-xl bg-ink px-4 py-3 text-sm font-medium text-white hover:bg-ink/90">Cadastrar documento</button>
    </form>
  );
}
