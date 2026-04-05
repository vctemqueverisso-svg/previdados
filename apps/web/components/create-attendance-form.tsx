"use client";

import { useState } from "react";
import { AttendanceItem } from "../lib/types";
import { getClientApiBaseUrl } from "../lib/client-api";

function getTokenFromCookie() {
  const value = document.cookie
    .split("; ")
    .find((item) => item.startsWith("token="))
    ?.split("=")[1];
  return value ?? "";
}

type Option = { id: string; label: string };

const ownerOptions = ["Brenda Soares Carvalho", "João Victor Soares Carvalho"];

const initialState = {
  clientId: "",
  caseId: "",
  kind: "CONSULTA_INICIAL",
  title: "",
  attendanceDate: "",
  ownerName: "João Victor Soares Carvalho",
  contactChannel: "",
  summary: "",
  clientReport: "",
  legalStrategy: "",
  requestedDocuments: "",
  nextSteps: ""
};

type FormState = typeof initialState;

type Props = {
  clients: Option[];
  cases: Option[];
  mode?: "create" | "edit";
  attendanceId?: string;
  initialValues?: Partial<AttendanceItem>;
  onSaved?: (attendance: AttendanceItem) => void;
  onCancel?: () => void;
  lockedClientId?: string;
  onClientChange?: (clientId: string) => void;
};

function buildInitialState(initialValues?: Partial<AttendanceItem>, lockedClientId?: string): FormState {
  return {
    ...initialState,
    ...initialValues,
    clientId: lockedClientId || initialValues?.client?.id || "",
    caseId: initialValues?.case?.id || "",
    attendanceDate: initialValues?.attendanceDate ? String(initialValues.attendanceDate).slice(0, 10) : ""
  };
}

function TopField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="space-y-2">
      <span className="block text-sm font-medium text-[color:var(--text-soft)]">{label}</span>
      {children}
    </label>
  );
}

export function CreateAttendanceForm({
  clients,
  cases: _cases,
  mode = "create",
  attendanceId,
  initialValues,
  onSaved,
  onCancel,
  lockedClientId,
  onClientChange
}: Props) {
  const [form, setForm] = useState<FormState>(() => buildInitialState(initialValues, lockedClientId));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch(
      `${getClientApiBaseUrl()}/api/attendances${mode === "edit" && attendanceId ? `/${attendanceId}` : ""}`,
      {
        method: mode === "edit" ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getTokenFromCookie()}`
        },
        body: JSON.stringify({
          ...form,
          title: form.title || `${form.kind}-${form.attendanceDate || "sem-data"}`,
          clientId: lockedClientId || form.clientId,
          caseId: form.caseId || undefined
        })
      }
    );

    setLoading(false);

    if (!response.ok) {
      setError(mode === "edit" ? "Não foi possível atualizar o atendimento." : "Não foi possível registrar o atendimento.");
      return;
    }

    const savedAttendance = (await response.json()) as AttendanceItem;

    if (mode === "create") {
      setForm(buildInitialState(undefined, lockedClientId));
    }

    onSaved?.(savedAttendance);
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6 md:p-7">
      <div className="grid gap-4 md:grid-cols-2">
        <TopField label="Cliente">
          <select
            value={form.clientId}
            disabled={Boolean(lockedClientId)}
            onChange={(e) => {
              const nextClientId = e.target.value;
              setForm({ ...form, clientId: nextClientId });
              onClientChange?.(nextClientId);
            }}
            required
          >
            <option value="">Selecione o cliente</option>
            {clients.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
              ))}
            </select>
        </TopField>

        <TopField label="Tipo de atendimento">
          <select value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value })}>
            <option value="CONSULTA_INICIAL">Consulta inicial</option>
            <option value="RETORNO">Retorno</option>
            <option value="TRIAGEM_DOCUMENTAL">Triagem documental</option>
            <option value="ESTRATEGIA_PROCESSUAL">Estratégia processual</option>
            <option value="POS_DECISAO">Pós-decisão</option>
          </select>
        </TopField>

        <TopField label="Data do atendimento">
          <input
            type="date"
            value={form.attendanceDate}
            onChange={(e) => setForm({ ...form, attendanceDate: e.target.value })}
            required
          />
        </TopField>

        <TopField label="Responsável pelo atendimento">
          <select value={form.ownerName} onChange={(e) => setForm({ ...form, ownerName: e.target.value })}>
            {ownerOptions.map((owner) => (
              <option key={owner} value={owner}>
                {owner}
              </option>
            ))}
          </select>
        </TopField>
      </div>

      <div className="mt-5 space-y-4">
        <textarea
          className="min-h-[180px] w-full rounded-[22px] border border-[rgba(24,38,63,0.08)] bg-white px-5 py-4 text-base leading-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]"
          placeholder="Relato do cliente"
          value={form.clientReport}
          onChange={(e) => setForm({ ...form, clientReport: e.target.value })}
        />

        <textarea
          className="min-h-[96px] w-full rounded-[22px] border border-[rgba(24,38,63,0.08)] bg-white px-5 py-4 text-sm leading-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]"
          placeholder="Documentos pendentes"
          value={form.requestedDocuments}
          onChange={(e) => setForm({ ...form, requestedDocuments: e.target.value })}
        />
      </div>

      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button className="rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-white hover:bg-ink/90" disabled={loading}>
          {loading ? "Salvando..." : mode === "edit" ? "Salvar alterações" : "Registrar atendimento"}
        </button>

        {mode === "edit" && onCancel ? (
          <button
            type="button"
            className="rounded-2xl border border-[rgba(24,38,63,0.12)] bg-white px-5 py-3 text-sm font-medium text-ink hover:bg-slate-50"
            onClick={onCancel}
          >
            Cancelar
          </button>
        ) : null}
      </div>
    </form>
  );
}
