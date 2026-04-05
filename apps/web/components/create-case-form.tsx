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

type Option = { id: string; label: string };

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

type Props = {
  clients: Option[];
  diseases: Option[];
  cids: Option[];
  experts: Option[];
};

const eventTypeOptions = [
  { value: "PROTOCOLO", label: "Protocolo" },
  { value: "PERICIA_ADMINISTRATIVA", label: "Perícia administrativa" },
  { value: "DECISAO_ADMINISTRATIVA", label: "Decisão administrativa" },
  { value: "AJUIZAMENTO", label: "Ajuizamento" },
  { value: "PERICIA_JUDICIAL", label: "Perícia judicial" },
  { value: "SENTENCA", label: "Sentença" },
  { value: "RECURSO", label: "Recurso" },
  { value: "ACORDAO", label: "Acórdão" },
  { value: "CUMPRIMENTO", label: "Cumprimento" },
  { value: "OUTRO", label: "Outro" }
] as const;

export function CreateCaseForm({ clients, diseases, cids, experts }: Props) {
  const [form, setForm] = useState({
    internalCode: "",
    clientId: clients[0]?.id ?? "",
    caseNumber: "",
    channelType: "JUDICIAL",
    benefitType: "AUXILIO_DOENCA",
    protocolDate: "",
    derDate: "",
    expertExamDate: "",
    decisionDate: "",
    mainDiseaseId: diseases[0]?.id ?? "",
    mainCidId: "",
    secondaryCidIds: [] as string[],
    profession: "",
    educationLevel: "",
    ageAtFiling: "",
    familyIncome: "",
    familyGroupDescription: "",
    expertId: "",
    courtAgencyName: "",
    courtDivision: "",
    city: "",
    state: "",
    urgentReliefRequested: false,
    currentStatus: "EM_ANALISE",
    strategySummary: "",
    proceduralEvents: [
      {
        eventType: "PROTOCOLO",
        eventDate: "",
        description: ""
      }
    ],
    result: {
      finalOutcome: "PENDENTE"
    }
  });
  const [mainCidSearch, setMainCidSearch] = useState("");
  const [secondaryCidSearch, setSecondaryCidSearch] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload = {
      ...form,
      mainCidId: form.mainCidId || undefined,
      ageAtFiling: form.ageAtFiling === "" ? undefined : Number(form.ageAtFiling),
      familyIncome: form.familyIncome === "" ? undefined : Number(form.familyIncome),
      proceduralEvents: form.proceduralEvents.filter((item) => item.eventDate)
    };

    await fetch(`${getClientApiBaseUrl()}/api/cases`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getTokenFromCookie()}`
      },
      body: JSON.stringify(payload)
    });

    window.location.reload();
  }

  return (
    <form onSubmit={handleSubmit} className="card grid gap-3 p-5 md:grid-cols-3">
      <input placeholder="ID interno" value={form.internalCode} onChange={(e) => setForm({ ...form, internalCode: e.target.value })} required />
      <select value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })}>
        {clients.map((item) => (
          <option key={item.id} value={item.id}>{item.label}</option>
        ))}
      </select>
      <input placeholder="Numero do processo/NB" value={form.caseNumber} onChange={(e) => setForm({ ...form, caseNumber: e.target.value })} />
      <select value={form.channelType} onChange={(e) => setForm({ ...form, channelType: e.target.value })}>
        <option value="ADMINISTRATIVO">Administrativo</option>
        <option value="JUDICIAL">Judicial</option>
      </select>
      <select value={form.benefitType} onChange={(e) => setForm({ ...form, benefitType: e.target.value })}>
        <option value="AUXILIO_DOENCA">Auxilio-doenca</option>
        <option value="APOSENTADORIA_INCAPACIDADE">Aposentadoria por incapacidade</option>
        <option value="BPC_LOAS">BPC/LOAS</option>
        <option value="OUTRO">Outro</option>
      </select>
      <select value={form.currentStatus} onChange={(e) => setForm({ ...form, currentStatus: e.target.value })}>
        <option value="EM_ANALISE">Em analise</option>
        <option value="AGUARDANDO_DOCUMENTOS">Aguardando documentos</option>
        <option value="EM_PERICIA">Em pericia</option>
        <option value="AGUARDANDO_DECISAO">Aguardando decisao</option>
        <option value="CONCLUIDO">Concluido</option>
      </select>
      <input type="date" title="Data do protocolo" value={form.protocolDate} onChange={(e) => setForm({ ...form, protocolDate: e.target.value })} />
      <input type="date" title="DER" value={form.derDate} onChange={(e) => setForm({ ...form, derDate: e.target.value })} />
      <input type="date" title="Data da perícia" value={form.expertExamDate} onChange={(e) => setForm({ ...form, expertExamDate: e.target.value })} />
      <select value={form.mainDiseaseId} onChange={(e) => setForm({ ...form, mainDiseaseId: e.target.value })}>
        {diseases.map((item) => (
          <option key={item.id} value={item.id}>{item.label}</option>
        ))}
      </select>
      <div className="space-y-2">
        <input
          list="case-cid-options"
          placeholder="CID principal (digite codigo ou descricao)"
          value={mainCidSearch}
          onChange={(e) => {
            const nextValue = e.target.value;
            setMainCidSearch(nextValue);
            setForm({ ...form, mainCidId: resolveOptionId(cids, nextValue) });
          }}
        />
        <p className="text-xs text-[color:var(--text-soft)]">
          {form.mainCidId ? `Selecionado: ${resolveOptionLabel(cids, form.mainCidId)}` : "Nenhum CID principal selecionado."}
        </p>
      </div>
      <select value={form.expertId} onChange={(e) => setForm({ ...form, expertId: e.target.value })}>
        <option value="">Sem perito</option>
        {experts.map((item) => (
          <option key={item.id} value={item.id}>{item.label}</option>
        ))}
      </select>
      <input placeholder="Profissao" value={form.profession} onChange={(e) => setForm({ ...form, profession: e.target.value })} />
      <input placeholder="Escolaridade" value={form.educationLevel} onChange={(e) => setForm({ ...form, educationLevel: e.target.value })} />
      <input
        type="number"
        min="0"
        placeholder="Idade no pedido"
        value={form.ageAtFiling}
        onChange={(e) => setForm({ ...form, ageAtFiling: e.target.value })}
      />
      <input
        type="number"
        min="0"
        step="0.01"
        placeholder="Renda familiar"
        value={form.familyIncome}
        onChange={(e) => setForm({ ...form, familyIncome: e.target.value })}
      />
      <input placeholder="Cidade" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
      <input placeholder="UF" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
      <input placeholder="Orgao/Agencia" value={form.courtAgencyName} onChange={(e) => setForm({ ...form, courtAgencyName: e.target.value })} />
      <input placeholder="Vara/Comarca" value={form.courtDivision} onChange={(e) => setForm({ ...form, courtDivision: e.target.value })} />
      <div className="md:col-span-3 rounded-[24px] border border-[rgba(24,38,63,0.08)] bg-[rgba(248,251,255,0.72)] p-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow">CIDs relacionados</p>
            <p className="mt-2 text-sm text-[color:var(--text-soft)]">
              Escolha um CID principal e adicione quantos CIDs complementares forem necessarios para representar o quadro clinico do cliente.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row">
            <input
              list="case-cid-options"
              placeholder="Adicionar CID complementar"
              value={secondaryCidSearch}
              onChange={(e) => setSecondaryCidSearch(e.target.value)}
              className="md:min-w-[320px]"
            />
            <button
              type="button"
              className="rounded-xl border border-[rgba(24,38,63,0.12)] bg-white px-4 py-3 text-sm font-medium text-ink hover:bg-slate-50"
              onClick={() => {
                const cidId = resolveOptionId(cids, secondaryCidSearch);
                if (!cidId || cidId === form.mainCidId || form.secondaryCidIds.includes(cidId)) {
                  return;
                }

                setForm({
                  ...form,
                  secondaryCidIds: [...form.secondaryCidIds, cidId]
                });
                setSecondaryCidSearch("");
              }}
            >
              Adicionar CID
            </button>
          </div>
        </div>

        <datalist id="case-cid-options">
          {cids.map((item) => (
            <option key={item.id} value={item.label} />
          ))}
        </datalist>

        <div className="mt-4 flex flex-wrap gap-2">
          {form.secondaryCidIds.length ? (
            form.secondaryCidIds.map((cidId) => (
              <button
                key={cidId}
                type="button"
                className="rounded-full border border-[rgba(24,38,63,0.12)] bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-ink hover:bg-slate-50"
                onClick={() =>
                  setForm({
                    ...form,
                    secondaryCidIds: form.secondaryCidIds.filter((item) => item !== cidId)
                  })
                }
              >
                {resolveOptionLabel(cids, cidId)} x
              </button>
            ))
          ) : (
            <p className="text-sm text-[color:var(--text-soft)]">Nenhum CID complementar adicionado.</p>
          )}
        </div>
      </div>
      <div className="md:col-span-3 rounded-[24px] border border-[rgba(24,38,63,0.08)] bg-[rgba(248,251,255,0.72)] p-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow">Linha do tempo processual</p>
            <p className="mt-2 text-sm text-[color:var(--text-soft)]">
              Lance aqui os eventos administrativos e judiciais que devem aparecer no histórico do caso.
            </p>
          </div>
          <button
            type="button"
            className="rounded-xl border border-[rgba(24,38,63,0.12)] bg-white px-4 py-3 text-sm font-medium text-ink hover:bg-slate-50"
            onClick={() =>
              setForm({
                ...form,
                proceduralEvents: [
                  ...form.proceduralEvents,
                  {
                    eventType: "OUTRO",
                    eventDate: "",
                    description: ""
                  }
                ]
              })
            }
          >
            Adicionar evento
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {form.proceduralEvents.map((event, index) => (
            <div key={`${event.eventType}-${index}`} className="grid gap-3 rounded-2xl border border-[rgba(24,38,63,0.08)] bg-white p-4 md:grid-cols-[1.1fr_0.8fr_1.6fr_auto]">
              <select
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
              <input
                placeholder="Descricao do evento"
                value={event.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    proceduralEvents: form.proceduralEvents.map((item, itemIndex) =>
                      itemIndex === index ? { ...item, description: e.target.value } : item
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
      <textarea className="md:col-span-3" placeholder="Composicao familiar" value={form.familyGroupDescription} onChange={(e) => setForm({ ...form, familyGroupDescription: e.target.value })} />
      <textarea className="md:col-span-3" placeholder="Observacoes estrategicas" value={form.strategySummary} onChange={(e) => setForm({ ...form, strategySummary: e.target.value })} />
      <label className="flex items-center gap-2 text-sm text-stone-600">
        <input type="checkbox" checked={form.urgentReliefRequested} onChange={(e) => setForm({ ...form, urgentReliefRequested: e.target.checked })} />
        Existe tutela de urgencia
      </label>
      <button className="rounded-xl bg-ink px-4 py-3 text-sm font-medium text-white hover:bg-ink/90">Cadastrar caso</button>
    </form>
  );
}
