"use client";

import { useMemo, useState } from "react";
import { getClientApiBaseUrl } from "../lib/client-api";
import { DeadlineItem } from "../lib/types";

type Option = { id: string; label: string };

function getTokenFromCookie() {
  const value = document.cookie
    .split("; ")
    .find((item) => item.startsWith("token="))
    ?.split("=")[1];
  return value ?? "";
}

const responsibleOptions = ["Brenda Soares Carvalho", "Joao Victor Soares Carvalho"];

const statusMeta = {
  PENDENTE: {
    label: "Pendente",
    badge: "border-[rgba(191,132,41,0.18)] bg-[rgba(191,132,41,0.12)] text-[#8b641c]"
  },
  CUMPRIDO: {
    label: "Cumprido",
    badge: "border-[rgba(39,104,74,0.18)] bg-[rgba(39,104,74,0.12)] text-[#205b43]"
  },
  NAO_CUMPRIDO: {
    label: "Nao cumprido",
    badge: "border-[rgba(143,58,58,0.18)] bg-[rgba(255,242,242,0.95)] text-[#8b3a3a]"
  }
} as const;

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("pt-BR");
}

function isOverdue(deadline: DeadlineItem) {
  if (deadline.status !== "PENDENTE") {
    return false;
  }

  const dueDate = new Date(deadline.dueDate);
  dueDate.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return dueDate < today;
}

export function DeadlineWorkspace({
  clients,
  initialDeadlines
}: {
  clients: Option[];
  initialDeadlines: DeadlineItem[];
}) {
  const [deadlines, setDeadlines] = useState(initialDeadlines);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    clientId: "",
    title: "",
    dueDate: "",
    responsibleName: responsibleOptions[0],
    notes: ""
  });

  const metrics = useMemo(() => {
    const pending = deadlines.filter((item) => item.status === "PENDENTE");
    const completed = deadlines.filter((item) => item.status === "CUMPRIDO");
    const overdue = pending.filter(isOverdue);

    return {
      pending: pending.length,
      completed: completed.length,
      overdue: overdue.length
    };
  }, [deadlines]);

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    const response = await fetch(`${getClientApiBaseUrl()}/api/deadlines`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getTokenFromCookie()}`
      },
      body: JSON.stringify({
        ...form,
        status: "PENDENTE"
      })
    });

    setSaving(false);

    if (!response.ok) {
      setError("Nao foi possivel registrar o prazo.");
      return;
    }

    const savedDeadline = (await response.json()) as DeadlineItem;
    setDeadlines((current) =>
      [...current, savedDeadline].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    );
    setForm({
      clientId: "",
      title: "",
      dueDate: "",
      responsibleName: responsibleOptions[0],
      notes: ""
    });
  }

  async function updateStatus(id: string, status: DeadlineItem["status"]) {
    const response = await fetch(`${getClientApiBaseUrl()}/api/deadlines/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getTokenFromCookie()}`
      },
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      return;
    }

    const updatedDeadline = (await response.json()) as DeadlineItem;
    setDeadlines((current) => current.map((item) => (item.id === id ? updatedDeadline : item)));
  }

  async function removeDeadline(id: string) {
    const response = await fetch(`${getClientApiBaseUrl()}/api/deadlines/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getTokenFromCookie()}`
      }
    });

    if (!response.ok) {
      return;
    }

    setDeadlines((current) => current.filter((item) => item.id !== id));
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <div className="card p-7">
          <p className="eyebrow">Inicio</p>
          <h1 className="mt-3 max-w-4xl text-[2.45rem] font-semibold leading-[0.96] tracking-[-0.04em] text-ink md:text-[3.4rem]">
            Controle os prazos do escritorio antes que a urgencia vire problema.
          </h1>
          <p className="mt-4 max-w-3xl text-[15px] leading-7 text-slate-600">
            Registre o que cada cliente ainda precisa juntar, defina o responsavel e acompanhe se o prazo foi cumprido ou nao.
          </p>

          <form onSubmit={handleCreate} className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="space-y-2 md:col-span-2">
              <span className="block text-sm font-medium text-[color:var(--text-soft)]">Cliente</span>
              <select value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })} required>
                <option value="">Selecione o cliente</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="block text-sm font-medium text-[color:var(--text-soft)]">Prazo ou pendencia</span>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Ex.: cliente deve juntar CNIS, RG e laudo medico"
                required
              />
            </label>

            <label className="space-y-2">
              <span className="block text-sm font-medium text-[color:var(--text-soft)]">Data limite</span>
              <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} required />
            </label>

            <label className="space-y-2">
              <span className="block text-sm font-medium text-[color:var(--text-soft)]">Responsavel</span>
              <select value={form.responsibleName} onChange={(e) => setForm({ ...form, responsibleName: e.target.value })}>
                {responsibleOptions.map((owner) => (
                  <option key={owner} value={owner}>
                    {owner}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="block text-sm font-medium text-[color:var(--text-soft)]">Observacoes</span>
              <textarea
                className="min-h-[110px]"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Ex.: cliente vai mandar os exames pelo WhatsApp e assinar procuração ate a data limite."
              />
            </label>

            {error ? <p className="text-sm text-[#8b3a3a] md:col-span-2">{error}</p> : null}

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-white hover:bg-ink/90 disabled:opacity-70"
              >
                {saving ? "Salvando..." : "Registrar prazo"}
              </button>
            </div>
          </form>
        </div>

        <div className="card p-7">
          <p className="eyebrow">Leitura rapida</p>
          <div className="mt-5 grid gap-4">
            <div className="rounded-[24px] border border-[rgba(24,38,63,0.08)] bg-[linear-gradient(180deg,rgba(21,34,56,0.98),rgba(17,28,46,0.98))] px-5 py-5 text-white">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-300">Pendencias abertas</p>
              <p className="mt-3 text-[2.4rem] font-semibold leading-none">{metrics.pending}</p>
              <p className="mt-3 text-sm leading-6 text-slate-200">Prazos ainda sem conclusao na mesa do escritorio.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[24px] border border-[rgba(24,38,63,0.08)] bg-[rgba(248,251,255,0.92)] px-5 py-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Em atraso</p>
                <p className="mt-3 text-[2rem] font-semibold leading-none text-ink">{metrics.overdue}</p>
                <p className="mt-3 text-sm text-slate-600">Prazos que passaram da data limite.</p>
              </div>
              <div className="rounded-[24px] border border-[rgba(24,38,63,0.08)] bg-[rgba(248,251,255,0.92)] px-5 py-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Cumpridos</p>
                <p className="mt-3 text-[2rem] font-semibold leading-none text-ink">{metrics.completed}</p>
                <p className="mt-3 text-sm text-slate-600">Pendencias ja resolvidas.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="card p-6">
        <p className="eyebrow">Prazos</p>
        <h2 className="mt-2 text-[2rem] font-semibold leading-[1.02] tracking-[-0.03em] text-ink">Controle por cliente</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Marque se o prazo foi cumprido, nao cumprido ou se ainda esta pendente, sempre com o responsavel bem definido.
        </p>

        <div className="mt-6 space-y-4">
          {deadlines.length ? (
            deadlines.map((deadline) => (
              <div
                key={deadline.id}
                className="rounded-[24px] border border-[rgba(24,38,63,0.08)] bg-[rgba(248,251,255,0.92)] px-5 py-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-semibold text-ink">{deadline.title}</h3>
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${statusMeta[deadline.status].badge}`}
                      >
                        {statusMeta[deadline.status].label}
                      </span>
                      {isOverdue(deadline) ? (
                        <span className="rounded-full border border-[rgba(143,58,58,0.18)] bg-[rgba(255,242,242,0.95)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#8b3a3a]">
                          Em atraso
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 text-sm text-slate-600">
                      <strong className="font-medium text-ink">{deadline.client.fullName}</strong> · ate {formatDate(deadline.dueDate)} · responsavel:{" "}
                      {deadline.responsibleName}
                    </p>
                    {deadline.notes ? <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">{deadline.notes}</p> : null}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => updateStatus(deadline.id, "CUMPRIDO")}
                      className="rounded-xl border border-[rgba(24,38,63,0.12)] bg-white px-4 py-2 text-sm font-medium text-ink hover:bg-slate-50"
                    >
                      Cumprido
                    </button>
                    <button
                      type="button"
                      onClick={() => updateStatus(deadline.id, "NAO_CUMPRIDO")}
                      className="rounded-xl border border-[rgba(140,45,45,0.14)] bg-[rgba(255,242,242,0.95)] px-4 py-2 text-sm font-medium text-[#8b3a3a] hover:bg-[rgba(255,235,235,1)]"
                    >
                      Nao cumprido
                    </button>
                    <button
                      type="button"
                      onClick={() => updateStatus(deadline.id, "PENDENTE")}
                      className="rounded-xl border border-[rgba(24,38,63,0.12)] bg-white px-4 py-2 text-sm font-medium text-ink hover:bg-slate-50"
                    >
                      Voltar para pendente
                    </button>
                    <button
                      type="button"
                      onClick={() => removeDeadline(deadline.id)}
                      className="rounded-xl border border-[rgba(140,45,45,0.14)] bg-white px-4 py-2 text-sm font-medium text-[#8b3a3a] hover:bg-[rgba(255,242,242,1)]"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[24px] border border-dashed border-[rgba(24,38,63,0.14)] bg-[rgba(248,251,255,0.7)] px-6 py-8 text-sm leading-7 text-slate-500">
              Nenhum prazo registrado ainda. Use a caixa acima para criar a primeira pendencia da equipe.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
