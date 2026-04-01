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
  clients: Option[];
  diseases: Option[];
  cids: Option[];
  experts: Option[];
};

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
    mainCidId: cids[0]?.id ?? "",
    profession: "",
    educationLevel: "",
    ageAtFiling: 0,
    familyIncome: 0,
    familyGroupDescription: "",
    expertId: "",
    courtAgencyName: "",
    courtDivision: "",
    city: "",
    state: "",
    urgentReliefRequested: false,
    currentStatus: "EM_ANALISE",
    strategySummary: "",
    result: {
      finalOutcome: "PENDENTE"
    }
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cases`, {
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
      <input type="date" value={form.protocolDate} onChange={(e) => setForm({ ...form, protocolDate: e.target.value })} />
      <input type="date" value={form.derDate} onChange={(e) => setForm({ ...form, derDate: e.target.value })} />
      <input type="date" value={form.expertExamDate} onChange={(e) => setForm({ ...form, expertExamDate: e.target.value })} />
      <select value={form.mainDiseaseId} onChange={(e) => setForm({ ...form, mainDiseaseId: e.target.value })}>
        {diseases.map((item) => (
          <option key={item.id} value={item.id}>{item.label}</option>
        ))}
      </select>
      <select value={form.mainCidId} onChange={(e) => setForm({ ...form, mainCidId: e.target.value })}>
        {cids.map((item) => (
          <option key={item.id} value={item.id}>{item.label}</option>
        ))}
      </select>
      <select value={form.expertId} onChange={(e) => setForm({ ...form, expertId: e.target.value })}>
        <option value="">Sem perito</option>
        {experts.map((item) => (
          <option key={item.id} value={item.id}>{item.label}</option>
        ))}
      </select>
      <input placeholder="Profissao" value={form.profession} onChange={(e) => setForm({ ...form, profession: e.target.value })} />
      <input placeholder="Escolaridade" value={form.educationLevel} onChange={(e) => setForm({ ...form, educationLevel: e.target.value })} />
      <input type="number" placeholder="Idade no pedido" value={form.ageAtFiling} onChange={(e) => setForm({ ...form, ageAtFiling: Number(e.target.value) })} />
      <input type="number" step="0.01" placeholder="Renda familiar" value={form.familyIncome} onChange={(e) => setForm({ ...form, familyIncome: Number(e.target.value) })} />
      <input placeholder="Cidade" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
      <input placeholder="UF" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
      <input placeholder="Orgao/Agencia" value={form.courtAgencyName} onChange={(e) => setForm({ ...form, courtAgencyName: e.target.value })} />
      <input placeholder="Vara/Comarca" value={form.courtDivision} onChange={(e) => setForm({ ...form, courtDivision: e.target.value })} />
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

