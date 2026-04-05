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

const initialState = {
  clientId: "",
  caseId: "",
  kind: "CONSULTA_INICIAL",
  title: "",
  attendanceDate: "",
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

export function CreateAttendanceForm({
  clients,
  cases,
  mode = "create",
  attendanceId,
  initialValues,
  onSaved,
  onCancel,
  lockedClientId
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
          clientId: lockedClientId || form.clientId,
          caseId: form.caseId || undefined
        })
      }
    );

    setLoading(false);

    if (!response.ok) {
      setError(mode === "edit" ? "Nao foi possivel atualizar o atendimento." : "Nao foi possivel registrar o atendimento.");
      return;
    }

    const savedAttendance = (await response.json()) as AttendanceItem;

    if (mode === "create") {
      setForm(buildInitialState(undefined, lockedClientId));
    }

    onSaved?.(savedAttendance);
  }

  return (
    <form onSubmit={handleSubmit} className="card grid gap-3 p-5 md:grid-cols-2">
      <select
        value={form.clientId}
        disabled={Boolean(lockedClientId)}
        onChange={(e) => setForm({ ...form, clientId: e.target.value })}
        required
      >
        <option value="">Selecione o cliente</option>
        {clients.map((item) => (
          <option key={item.id} value={item.id}>
            {item.label}
          </option>
        ))}
      </select>
      <select value={form.caseId} onChange={(e) => setForm({ ...form, caseId: e.target.value })}>
        <option value="">Sem caso vinculado</option>
        {cases.map((item) => (
          <option key={item.id} value={item.id}>
            {item.label}
          </option>
        ))}
      </select>
      <select value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value })}>
        <option value="CONSULTA_INICIAL">Consulta inicial</option>
        <option value="RETORNO">Retorno</option>
        <option value="TRIAGEM_DOCUMENTAL">Triagem documental</option>
        <option value="ESTRATEGIA_PROCESSUAL">Estrategia processual</option>
        <option value="POS_DECISAO">Pos-decisao</option>
      </select>
      <input
        type="date"
        value={form.attendanceDate}
        onChange={(e) => setForm({ ...form, attendanceDate: e.target.value })}
        required
      />
      <input
        className="md:col-span-2"
        placeholder="Titulo do atendimento"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        required
      />
      <input
        className="md:col-span-2"
        placeholder="Canal de contato (presencial, WhatsApp, telefone...)"
        value={form.contactChannel}
        onChange={(e) => setForm({ ...form, contactChannel: e.target.value })}
      />
      <textarea
        className="md:col-span-2"
        placeholder="Resumo do atendimento"
        value={form.summary}
        onChange={(e) => setForm({ ...form, summary: e.target.value })}
      />
      <textarea
        className="md:col-span-2"
        placeholder="Relato do cliente"
        value={form.clientReport}
        onChange={(e) => setForm({ ...form, clientReport: e.target.value })}
      />
      <textarea
        className="md:col-span-2"
        placeholder="Estrategia juridica discutida"
        value={form.legalStrategy}
        onChange={(e) => setForm({ ...form, legalStrategy: e.target.value })}
      />
      <textarea
        className="md:col-span-2"
        placeholder="Documentos solicitados"
        value={form.requestedDocuments}
        onChange={(e) => setForm({ ...form, requestedDocuments: e.target.value })}
      />
      <textarea
        className="md:col-span-2"
        placeholder="Proximos passos"
        value={form.nextSteps}
        onChange={(e) => setForm({ ...form, nextSteps: e.target.value })}
      />
      {error ? <p className="md:col-span-2 text-sm text-red-600">{error}</p> : null}
      <div className="md:col-span-2 flex flex-wrap gap-3">
        <button className="rounded-xl bg-ink px-4 py-3 text-sm font-medium text-white hover:bg-ink/90" disabled={loading}>
          {loading ? "Salvando..." : mode === "edit" ? "Salvar alteracoes" : "Registrar atendimento"}
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
