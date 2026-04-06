"use client";

import { useState } from "react";
import { getClientApiBaseUrl } from "../lib/client-api";
import { CaseItem } from "../lib/types";
import { normalizeMultilineText, normalizeSingleLineText } from "./utils";

function getTokenFromCookie() {
  const value = document.cookie
    .split("; ")
    .find((item) => item.startsWith("token="))
    ?.split("=")[1];
  return value ?? "";
}

type Option = { id: string; label: string };

type Props = {
  clients: Option[];
  diseases: Option[];
  cids: Option[];
  experts?: Option[];
  lockedClientId?: string;
  onClientChange?: (clientId: string) => void;
  onSaved?: (savedCase: CaseItem) => void;
};

type ProceduralEvent = {
  eventType: string;
  eventDate: string;
  description: string;
};

type TextFieldName =
  | "internalCode"
  | "caseNumber"
  | "profession"
  | "educationLevel"
  | "expertName"
  | "expertRegistryNumber"
  | "courtAgencyName"
  | "courtDivision"
  | "city"
  | "state";

const eventTypeOptions = [
  { value: "PROTOCOLO", label: "Protocolo" },
  { value: "PERICIA_MEDICA_ADMINISTRATIVA", label: "Perícia médica administrativa" },
  { value: "PERICIA_SOCIAL_ADMINISTRATIVA", label: "Perícia social administrativa" },
  { value: "DECISAO_ADMINISTRATIVA", label: "Decisão administrativa" },
  { value: "AJUIZAMENTO", label: "Ajuizamento" },
  { value: "PERICIA_MEDICA_JUDICIAL", label: "Perícia médica judicial" },
  { value: "PERICIA_SOCIAL_JUDICIAL", label: "Perícia social judicial" },
  { value: "SENTENCA", label: "Sentença" },
  { value: "RECURSO", label: "Recurso" },
  { value: "ACORDAO", label: "Acórdão" },
  { value: "CUMPRIMENTO", label: "Cumprimento" },
  { value: "OUTRO", label: "Outro" }
] as const;

function resolveOptionId(options: Option[], query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return "";
  }

  const exactMatch = options.find((item) => item.label.toLowerCase() === normalizedQuery || item.id === query);
  if (exactMatch) {
    return exactMatch.id;
  }

  const startsWithMatch = options.find((item) => item.label.toLowerCase().startsWith(normalizedQuery));
  return startsWithMatch?.id ?? "";
}

function resolveOptionLabel(options: Option[], id: string) {
  return options.find((item) => item.id === id)?.label ?? "";
}

function Section({
  title,
  description,
  children
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[28px] border border-[rgba(24,38,63,0.08)] bg-[rgba(248,251,255,0.78)] p-5 shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
      <div className="mb-4">
        <p className="eyebrow">{title}</p>
        {description ? <p className="mt-2 text-sm text-[color:var(--text-soft)]">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  children,
  className = ""
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`space-y-2 ${className}`}>
      <span className="block text-sm font-medium text-[color:var(--text-soft)]">{label}</span>
      {children}
    </label>
  );
}

export function CreateCaseForm({ clients, diseases, cids, lockedClientId, onClientChange, onSaved }: Props) {
  const defaultDiseaseId = diseases[0]?.id ?? "";
  const [form, setForm] = useState({
    internalCode: "",
    clientId: lockedClientId || clients[0]?.id || "",
    caseNumber: "",
    channelType: "JUDICIAL",
    benefitType: "AUXILIO_DOENCA",
    protocolDate: "",
    derDate: "",
    expertExamDate: "",
    decisionDate: "",
    mainDiseaseId: defaultDiseaseId,
    mainCidId: "",
    secondaryCidIds: [] as string[],
    profession: "",
    educationLevel: "",
    ageAtFiling: "",
    familyIncome: "",
    familyGroupDescription: "",
    expertId: "",
    expertName: "",
    expertRegistryNumber: "",
    courtAgencyName: "",
    courtDivision: "",
    city: "",
    state: "",
    urgentReliefRequested: false,
    currentStatus: "EM_ANALISE",
    strategySummary: "",
    proceduralEvents: [{ eventType: "PROTOCOLO", eventDate: "", description: "" }] as ProceduralEvent[],
    result: {
      administrativeResult: "PENDENTE",
      judicialResult: "PENDENTE",
      finalOutcome: "PENDENTE"
    }
  });
  const [mainCidSearch, setMainCidSearch] = useState("");
  const [mainDiseaseSearch, setMainDiseaseSearch] = useState(resolveOptionLabel(diseases, defaultDiseaseId));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function updateTextField(field: TextFieldName, value: string) {
    setForm((current) => ({
      ...current,
      [field]: normalizeSingleLineText(value)
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSaving(true);

    const payload = {
      ...form,
      internalCode: normalizeSingleLineText(form.internalCode),
      caseNumber: normalizeSingleLineText(form.caseNumber),
      mainCidId: form.mainCidId || undefined,
      profession: normalizeSingleLineText(form.profession),
      educationLevel: normalizeSingleLineText(form.educationLevel),
      expertName: normalizeSingleLineText(form.expertName),
      expertRegistryNumber: normalizeSingleLineText(form.expertRegistryNumber),
      ageAtFiling: form.ageAtFiling === "" ? undefined : Number(form.ageAtFiling),
      familyIncome: form.familyIncome === "" ? undefined : Number(form.familyIncome),
      familyGroupDescription: normalizeMultilineText(form.familyGroupDescription),
      courtAgencyName: normalizeSingleLineText(form.courtAgencyName),
      courtDivision: normalizeSingleLineText(form.courtDivision),
      city: normalizeSingleLineText(form.city),
      state: normalizeSingleLineText(form.state),
      strategySummary: normalizeMultilineText(form.strategySummary),
      proceduralEvents: form.proceduralEvents
        .filter((item) => item.eventDate)
        .map((item) => ({ ...item, description: normalizeMultilineText(item.description) }))
    };

    const response = await fetch(`${getClientApiBaseUrl()}/api/cases`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getTokenFromCookie()}`
      },
      body: JSON.stringify(payload)
    });

    setSaving(false);

    if (!response.ok) {
      const responseBody = await response.json().catch(() => null);
      const apiMessage = Array.isArray(responseBody?.message) ? responseBody.message.join(" ") : responseBody?.message;
      setError(apiMessage || "Não foi possível cadastrar o caso.");
      return;
    }

    const savedCase = await response.json();

    setForm((current) => ({
      ...current,
      internalCode: "",
      caseNumber: "",
      protocolDate: "",
      derDate: "",
      expertExamDate: "",
      decisionDate: "",
      profession: "",
      educationLevel: "",
      ageAtFiling: "",
      familyIncome: "",
      familyGroupDescription: "",
      expertId: "",
      expertName: "",
      expertRegistryNumber: "",
      courtAgencyName: "",
      courtDivision: "",
      city: "",
      state: "",
      strategySummary: "",
      proceduralEvents: [{ eventType: "PROTOCOLO", eventDate: "", description: "" }],
      result: {
        administrativeResult: "PENDENTE",
        judicialResult: "PENDENTE",
        finalOutcome: "PENDENTE"
      }
    }));
    setMainCidSearch("");
    setMainDiseaseSearch(resolveOptionLabel(diseases, form.mainDiseaseId));
    onClientChange?.(savedCase.client.id);
    onSaved?.(savedCase);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Section title="Identificação do caso" description="Preencha apenas o essencial para abrir o acompanhamento do cliente.">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <Field label="Cliente" className="xl:col-span-2">
            <select
              className="w-full"
              value={form.clientId}
              disabled={Boolean(lockedClientId)}
              onChange={(e) => {
                const nextClientId = e.target.value;
                setForm({ ...form, clientId: nextClientId });
                onClientChange?.(nextClientId);
              }}
            >
              {clients.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Via" className="xl:col-span-2">
            <select className="w-full" value={form.channelType} onChange={(e) => setForm({ ...form, channelType: e.target.value })}>
              <option value="ADMINISTRATIVO">Administrativo</option>
              <option value="JUDICIAL">Judicial</option>
            </select>
          </Field>

          <Field label="Fase" className="xl:col-span-2">
            <select className="w-full" value={form.currentStatus} onChange={(e) => setForm({ ...form, currentStatus: e.target.value })}>
              <option value="EM_ANALISE">Em análise</option>
              <option value="AGUARDANDO_DOCUMENTOS">Exigência</option>
              <option value="CONCLUIDO">Concluído</option>
            </select>
          </Field>

          <Field label="Benefício" className="xl:col-span-2">
            <select className="w-full" value={form.benefitType} onChange={(e) => setForm({ ...form, benefitType: e.target.value })}>
              <option value="AUXILIO_DOENCA">Auxílio-doença</option>
              <option value="APOSENTADORIA_INCAPACIDADE">Aposentadoria por incapacidade</option>
              <option value="BPC_LOAS">BPC/LOAS</option>
              <option value="OUTRO">Outro</option>
            </select>
          </Field>

          <Field label="Número do processo ou NB" className="xl:col-span-3">
            <input
              className="w-full"
              placeholder="Número do processo ou NB"
              value={form.caseNumber}
              onChange={(e) => updateTextField("caseNumber", e.target.value)}
            />
          </Field>

          <Field label="ID interno" className="xl:col-span-1">
            <input
              className="w-full"
              placeholder="ID interno"
              value={form.internalCode}
              onChange={(e) => updateTextField("internalCode", e.target.value)}
              required
            />
          </Field>
        </div>
      </Section>

      <Section title="Quadro clínico" description="Selecione a doença principal, o CID principal e informe o perito manualmente, quando houver.">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Field label="Doença principal">
            <div className="space-y-2">
              <input
                className="w-full"
                list="case-disease-options"
                placeholder="Digite a doença principal"
                autoComplete="off"
                spellCheck={false}
                value={mainDiseaseSearch}
                onChange={(e) => {
                  const nextValue = normalizeSingleLineText(e.target.value);
                  setMainDiseaseSearch(nextValue);
                  setForm({ ...form, mainDiseaseId: resolveOptionId(diseases, nextValue) });
                }}
              />
              <p className="text-xs text-[color:var(--text-soft)]">
                {form.mainDiseaseId ? `Selecionada: ${resolveOptionLabel(diseases, form.mainDiseaseId)}` : "Nenhuma doença principal selecionada."}
              </p>
            </div>
          </Field>

          <Field label="CID principal">
            <div className="space-y-2">
              <input
                className="w-full"
                list="case-cid-options"
                placeholder="Digite o CID principal"
                autoComplete="off"
                spellCheck={false}
                value={mainCidSearch}
                onChange={(e) => {
                  const nextValue = normalizeSingleLineText(e.target.value);
                  setMainCidSearch(nextValue);
                  setForm({ ...form, mainCidId: resolveOptionId(cids, nextValue) });
                }}
              />
              <p className="text-xs text-[color:var(--text-soft)]">
                {form.mainCidId ? `Selecionado: ${resolveOptionLabel(cids, form.mainCidId)}` : "Nenhum CID principal selecionado."}
              </p>
            </div>
          </Field>

          <Field label="Perito">
            <div className="grid gap-3 md:grid-cols-2">
              <input
                className="w-full"
                placeholder="Nome do perito"
                value={form.expertName}
                onChange={(e) => updateTextField("expertName", e.target.value)}
              />
              <input
                className="w-full"
                placeholder="CRM ou registro"
                value={form.expertRegistryNumber}
                onChange={(e) => updateTextField("expertRegistryNumber", e.target.value)}
              />
            </div>
          </Field>
        </div>

        <datalist id="case-cid-options">
          {cids.map((item) => (
            <option key={item.id} value={item.label} />
          ))}
        </datalist>

        <datalist id="case-disease-options">
          {diseases.map((item) => (
            <option key={item.id} value={item.label} />
          ))}
        </datalist>
      </Section>

      <Section title="Resultado do caso" description="Esses dados alimentam os indicadores e relatórios da tela inicial.">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Field label="Resultado administrativo">
            <select
              className="w-full"
              value={form.result.administrativeResult ?? "PENDENTE"}
              onChange={(e) =>
                setForm({
                  ...form,
                  result: {
                    ...form.result,
                    administrativeResult: e.target.value
                  }
                })
              }
            >
              <option value="PENDENTE">Pendente</option>
              <option value="DEFERIDO">Concedido via administrativa</option>
              <option value="INDEFERIDO">Negado via administrativa</option>
            </select>
          </Field>

          <Field label="Resultado judicial">
            <select
              className="w-full"
              value={form.result.judicialResult ?? "PENDENTE"}
              onChange={(e) =>
                setForm({
                  ...form,
                  result: {
                    ...form.result,
                    judicialResult: e.target.value
                  }
                })
              }
            >
              <option value="PENDENTE">Pendente</option>
              <option value="PROCEDENTE">Procedente</option>
              <option value="IMPROCEDENTE">Improcedente</option>
              <option value="PARCIALMENTE_PROCEDENTE">Parcialmente procedente</option>
              <option value="ACORDO">Acordo</option>
            </select>
          </Field>

          <Field label="Desfecho final">
            <select
              className="w-full"
              value={form.result.finalOutcome ?? "PENDENTE"}
              onChange={(e) =>
                setForm({
                  ...form,
                  result: {
                    ...form.result,
                    finalOutcome: e.target.value
                  }
                })
              }
            >
              <option value="PENDENTE">Pendente</option>
              <option value="DEFERIDO">Concedido via administrativa</option>
              <option value="INDEFERIDO">Negado via administrativa</option>
              <option value="PROCEDENTE">Procedente</option>
              <option value="IMPROCEDENTE">Improcedente</option>
              <option value="PARCIALMENTE_PROCEDENTE">Parcialmente procedente</option>
              <option value="ACORDO">Acordo</option>
            </select>
          </Field>
        </div>
      </Section>

      <details className="overflow-hidden rounded-[28px] border border-[rgba(24,38,63,0.08)] bg-[rgba(248,251,255,0.78)] shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
        <summary className="list-none cursor-pointer px-5 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-base font-semibold text-ink">Linha do tempo processual</p>
              <p className="mt-1 text-sm text-[color:var(--text-soft)]">
                Abra este bloco apenas quando quiser lançar marcos relevantes do andamento.
              </p>
            </div>
            <span className="rounded-full border border-[rgba(24,38,63,0.1)] bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--text-soft)]">
              Oculta
            </span>
          </div>
        </summary>

        <div className="border-t border-[rgba(24,38,63,0.08)] px-5 py-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-ink">Eventos do andamento</p>
              <p className="mt-1 text-sm text-[color:var(--text-soft)]">
                Adicione só os marcos realmente relevantes da tramitação administrativa ou judicial.
              </p>
            </div>
            <button
              type="button"
              className="rounded-xl border border-[rgba(24,38,63,0.12)] bg-white px-4 py-3 text-sm font-medium text-ink hover:bg-slate-50"
              onClick={() =>
                setForm({
                  ...form,
                  proceduralEvents: [...form.proceduralEvents, { eventType: "OUTRO", eventDate: "", description: "" }]
                })
              }
            >
              Adicionar evento
            </button>
          </div>

          <div className="space-y-3">
            {form.proceduralEvents.map((event, index) => (
              <div
                key={`${event.eventType}-${index}`}
                className="grid gap-3 rounded-2xl border border-[rgba(24,38,63,0.08)] bg-white p-4 md:grid-cols-[minmax(180px,220px)_180px_minmax(220px,1fr)_auto]"
              >
                <select
                  className="w-full"
                  value={event.eventType}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      proceduralEvents: form.proceduralEvents.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, eventType: e.target.value } : item
                      )
                    })
                  }
                >
                  {eventTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <input
                  className="w-full"
                  type="date"
                  value={event.eventDate}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      proceduralEvents: form.proceduralEvents.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, eventDate: e.target.value } : item
                      )
                    })
                  }
                />

                <textarea
                  className="min-h-[54px] w-full resize-y"
                  placeholder="Descrição do evento"
                  value={event.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      proceduralEvents: form.proceduralEvents.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, description: normalizeMultilineText(e.target.value) } : item
                      )
                    })
                  }
                />

                <button
                  type="button"
                  className="rounded-xl border border-[rgba(140,45,45,0.14)] bg-[rgba(255,242,242,0.95)] px-3 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-[color:#8b3a3a] hover:bg-[rgba(255,235,235,1)]"
                  onClick={() =>
                    setForm({
                      ...form,
                      proceduralEvents:
                        form.proceduralEvents.length === 1
                          ? [{ eventType: "PROTOCOLO", eventDate: "", description: "" }]
                          : form.proceduralEvents.filter((_, itemIndex) => itemIndex !== index)
                    })
                  }
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
        </div>
      </details>

      <div className="flex justify-end">
        <button
          disabled={saving}
          className="rounded-xl bg-ink px-6 py-3 text-sm font-medium text-white hover:bg-ink/90 disabled:opacity-70"
        >
          {saving ? "Salvando..." : "Cadastrar caso"}
        </button>
      </div>

      {error ? <p className="text-sm text-[#8b3a3a]">{error}</p> : null}
    </form>
  );
}
