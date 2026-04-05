"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AttendanceItem, CaseItem, Client } from "../lib/types";
import { getClientApiBaseUrl } from "../lib/client-api";
import { CreateAttendanceForm } from "./create-attendance-form";

function getTokenFromCookie() {
  const value = document.cookie
    .split("; ")
    .find((item) => item.startsWith("token="))
    ?.split("=")[1];
  return value ?? "";
}

function formatAttendanceKind(value: string) {
  switch (value) {
    case "CONSULTA_INICIAL":
      return "Consulta inicial";
    case "RETORNO":
      return "Retorno";
    case "TRIAGEM_DOCUMENTAL":
      return "Triagem documental";
    case "ESTRATEGIA_PROCESSUAL":
      return "Estrategia processual";
    case "POS_DECISAO":
      return "Pos-decisao";
    default:
      return "Atendimento";
  }
}

function sortAttendances(attendances: AttendanceItem[]) {
  return [...attendances].sort((a, b) => new Date(b.attendanceDate).getTime() - new Date(a.attendanceDate).getTime());
}

type Props = {
  initialAttendances: AttendanceItem[];
  clients: Client[];
  cases: CaseItem[];
};

export function AttendanceRegistry({ initialAttendances, clients, cases }: Props) {
  const [attendances, setAttendances] = useState(() => sortAttendances(initialAttendances));
  const [editingAttendanceId, setEditingAttendanceId] = useState<string | null>(null);
  const [busyAttendanceId, setBusyAttendanceId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");

  const editingAttendance = useMemo(
    () => attendances.find((attendance) => attendance.id === editingAttendanceId) ?? null,
    [attendances, editingAttendanceId]
  );

  async function handleDelete(attendance: AttendanceItem) {
    if (!window.confirm(`Deseja realmente excluir o atendimento "${attendance.title}"?`)) {
      return;
    }

    setBusyAttendanceId(attendance.id);
    setFeedback("");

    const response = await fetch(`${getClientApiBaseUrl()}/api/attendances/${attendance.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getTokenFromCookie()}`
      }
    });

    setBusyAttendanceId(null);

    if (!response.ok) {
      setFeedback("Nao foi possivel excluir o atendimento.");
      return;
    }

    setAttendances((current) => current.filter((item) => item.id !== attendance.id));
    setFeedback("Atendimento removido com sucesso.");
  }

  const clientOptions = clients.map((item) => ({ id: item.id, label: item.fullName }));
  const caseOptions = cases.map((item) => ({ id: item.id, label: item.internalCode }));

  return (
    <div className="space-y-6">
      {editingAttendance ? (
        <div className="space-y-3">
          <div>
            <p className="eyebrow">Edicao</p>
            <h3 className="mt-2 text-2xl font-semibold text-ink">Atualizar atendimento</h3>
            <p className="mt-2 text-sm text-[color:var(--text-soft)]">
              Ajuste o registro da conversa, da estrategia e dos proximos passos sempre que o cliente retornar.
            </p>
          </div>
          <CreateAttendanceForm
            mode="edit"
            attendanceId={editingAttendance.id}
            initialValues={editingAttendance}
            clients={clientOptions}
            cases={caseOptions}
            onCancel={() => {
              setEditingAttendanceId(null);
              setFeedback("");
            }}
            onSaved={(savedAttendance) => {
              setAttendances((current) => sortAttendances(current.map((item) => (item.id === savedAttendance.id ? savedAttendance : item))));
              setEditingAttendanceId(null);
              setFeedback("Atendimento atualizado com sucesso.");
            }}
          />
        </div>
      ) : (
        <CreateAttendanceForm
          clients={clientOptions}
          cases={caseOptions}
          onSaved={(savedAttendance) => {
            setAttendances((current) => sortAttendances([savedAttendance, ...current]));
            setFeedback("Atendimento registrado com sucesso.");
          }}
        />
      )}

      <div className="space-y-4">
        {attendances.map((attendance) => (
          <div key={attendance.id} className="card p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-lg font-semibold text-ink">{attendance.title}</p>
                <p className="mt-2 text-sm text-slate-600">
                  {formatAttendanceKind(attendance.kind)} | {new Date(attendance.attendanceDate).toLocaleDateString("pt-BR")} | {attendance.contactChannel || "Canal nao informado"}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="rounded-xl border border-[rgba(24,38,63,0.12)] bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-ink hover:bg-slate-50"
                  onClick={() => {
                    setEditingAttendanceId(attendance.id);
                    setFeedback("");
                  }}
                >
                  Editar
                </button>
                <button
                  type="button"
                  className="rounded-xl border border-[rgba(140,45,45,0.14)] bg-[rgba(255,242,242,0.95)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[color:#8b3a3a] hover:bg-[rgba(255,235,235,1)] disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={busyAttendanceId === attendance.id}
                  onClick={() => handleDelete(attendance)}
                >
                  {busyAttendanceId === attendance.id ? "Excluindo..." : "Excluir"}
                </button>
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Cliente</p>
                <p className="mt-2 text-sm text-slate-700">
                  <Link href={`/clientes/${attendance.client.id}`} className="text-ink hover:text-gold">
                    {attendance.client.fullName}
                  </Link>
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Caso vinculado</p>
                <p className="mt-2 text-sm text-slate-700">
                  {attendance.case ? (
                    <Link href={`/casos/${attendance.case.id}`} className="text-ink hover:text-gold">
                      {attendance.case.internalCode}
                    </Link>
                  ) : (
                    "Sem caso vinculado"
                  )}
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Resumo</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">{attendance.summary || "Resumo ainda nao registrado."}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Relato do cliente</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">{attendance.clientReport || "Relato ainda nao registrado."}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Estrategia juridica</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">{attendance.legalStrategy || "Estrategia ainda nao registrada."}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Documentos solicitados</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">{attendance.requestedDocuments || "Nenhum documento solicitado."}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Proximos passos</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">{attendance.nextSteps || "Sem proximos passos registrados."}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {feedback ? <p className="text-sm text-[color:var(--text-soft)]">{feedback}</p> : null}
    </div>
  );
}
