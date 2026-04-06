"use client";

import { useMemo, useState } from "react";
import { Calculator, Landmark, Receipt, Wallet } from "lucide-react";
import { getClientApiBaseUrl } from "../lib/client-api";
import { CaseItem, Client, FinancialControlItem } from "../lib/types";

function getTokenFromCookie() {
  return (
    document.cookie
      .split("; ")
      .find((item) => item.startsWith("token="))
      ?.split("=")[1] ?? ""
  );
}

function toMoney(value?: string | number | null) {
  return Number(value ?? 0);
}

function formatMoney(value?: string | number | null) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(toMoney(value));
}

function formatBenefit(value: string) {
  switch (value) {
    case "AUXILIO_DOENCA":
      return "Auxílio-doença";
    case "APOSENTADORIA_INCAPACIDADE":
      return "Aposentadoria por incapacidade";
    case "BPC_LOAS":
      return "BPC/LOAS";
    default:
      return "Outro";
  }
}

function formatChannel(value: string) {
  return value === "JUDICIAL" ? "Judicial" : "Administrativo";
}

function resolvePlannedInstallments(caseItem?: CaseItem | null, projectedBenefitMonths?: number, manualInstallments?: number) {
  if (!caseItem) {
    return 0;
  }

  if (manualInstallments && manualInstallments > 0) {
    return manualInstallments;
  }

  if (caseItem.benefitType === "AUXILIO_DOENCA") {
    return projectedBenefitMonths ?? 0;
  }

  return caseItem.channelType === "JUDICIAL" ? 24 : 12;
}

function MetricCard({
  label,
  value,
  helper,
  icon
}: {
  label: string;
  value: string;
  helper: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-[24px] border border-[rgba(24,38,63,0.08)] bg-[rgba(248,251,255,0.92)] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">{label}</p>
          <p className="mt-3 text-[2rem] font-semibold leading-none text-ink">{value}</p>
        </div>
        <div className="rounded-2xl bg-[rgba(24,38,63,0.06)] p-3 text-ink">{icon}</div>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600">{helper}</p>
    </div>
  );
}

type FormState = {
  clientId: string;
  caseId: string;
  minimumWageAmount: string;
  projectedBenefitMonths: string;
  plannedInstallments: string;
  paidInstallments: string;
  arrearsAmount: string;
  arrearsFeePaidAmount: string;
  notes: string;
};

const initialFormState: FormState = {
  clientId: "",
  caseId: "",
  minimumWageAmount: "1621",
  projectedBenefitMonths: "",
  plannedInstallments: "",
  paidInstallments: "0",
  arrearsAmount: "",
  arrearsFeePaidAmount: "",
  notes: ""
};

export function FinanceWorkspace({
  clients,
  cases,
  initialControls
}: {
  clients: Client[];
  cases: CaseItem[];
  initialControls: FinancialControlItem[];
}) {
  const [controls, setControls] = useState(initialControls);
  const [filterClientId, setFilterClientId] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [form, setForm] = useState<FormState>(initialFormState);

  const selectedCase = useMemo(
    () => cases.find((item) => item.id === form.caseId) ?? null,
    [cases, form.caseId]
  );

  const filteredCases = useMemo(() => {
    if (!form.clientId) {
      return [];
    }

    return cases.filter((item) => item.client.id === form.clientId);
  }, [cases, form.clientId]);

  const visibleControls = useMemo(() => {
    if (!filterClientId) {
      return controls;
    }

    return controls.filter((item) => item.case.client.id === filterClientId);
  }, [controls, filterClientId]);

  const metrics = useMemo(() => {
    return visibleControls.reduce(
      (acc, item) => {
        const installmentValue = toMoney(item.installmentValue);
        const arrearsFeeValue = toMoney(item.arrearsFeeValue);
        const arrearsFeePaidAmount = toMoney(item.arrearsFeePaidAmount);
        const pendingInstallments = Math.max(item.plannedInstallments - item.paidInstallments, 0);

        acc.totalExpected += installmentValue * item.plannedInstallments + arrearsFeeValue;
        acc.openInstallments += installmentValue * pendingInstallments;
        acc.received += installmentValue * item.paidInstallments + arrearsFeePaidAmount;
        return acc;
      },
      { totalExpected: 0, openInstallments: 0, received: 0 }
    );
  }, [visibleControls]);

  const preview = useMemo(() => {
    const minimumWageAmount = Number(form.minimumWageAmount || 0);
    const installmentValue = Number(((minimumWageAmount * 30) / 100).toFixed(2));
    const projectedBenefitMonths = Number(form.projectedBenefitMonths || 0) || undefined;
    const manualInstallments = Number(form.plannedInstallments || 0) || undefined;
    const plannedInstallments = resolvePlannedInstallments(selectedCase, projectedBenefitMonths, manualInstallments);
    const paidInstallments = Number(form.paidInstallments || 0);
    const arrearsAmount = Number(form.arrearsAmount || 0);
    const arrearsFeeValue = Number(((arrearsAmount * 30) / 100).toFixed(2));
    const arrearsFeePaidAmount = Number(form.arrearsFeePaidAmount || 0);

    return {
      installmentValue,
      plannedInstallments,
      remainingInstallments: Math.max(plannedInstallments - paidInstallments, 0),
      installmentSubtotal: installmentValue * plannedInstallments,
      arrearsFeeValue,
      totalExpected: installmentValue * plannedInstallments + arrearsFeeValue,
      totalReceived: installmentValue * paidInstallments + arrearsFeePaidAmount
    };
  }, [form, selectedCase]);

  function resetForm() {
    setForm(initialFormState);
    setEditingId(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.caseId) {
      setFeedback("Selecione um caso para registrar o financeiro.");
      return;
    }

    setSaving(true);
    setFeedback("");

    const payload = {
      caseId: form.caseId,
      minimumWageAmount: Number(form.minimumWageAmount || 0),
      projectedBenefitMonths: form.projectedBenefitMonths ? Number(form.projectedBenefitMonths) : undefined,
      plannedInstallments: form.plannedInstallments ? Number(form.plannedInstallments) : undefined,
      paidInstallments: Number(form.paidInstallments || 0),
      arrearsAmount: form.arrearsAmount ? Number(form.arrearsAmount) : undefined,
      arrearsFeePaidAmount: form.arrearsFeePaidAmount ? Number(form.arrearsFeePaidAmount) : undefined,
      notes: form.notes || undefined
    };

    const response = await fetch(
      `${getClientApiBaseUrl()}/api/finance${editingId ? `/${editingId}` : ""}`,
      {
        method: editingId ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getTokenFromCookie()}`
        },
        body: JSON.stringify(payload)
      }
    );

    setSaving(false);

    if (!response.ok) {
      setFeedback("Não foi possível salvar o controle financeiro.");
      return;
    }

    const savedItem = (await response.json()) as FinancialControlItem;
    setControls((current) => {
      const exists = current.some((item) => item.id === savedItem.id);
      if (exists) {
        return current.map((item) => (item.id === savedItem.id ? savedItem : item));
      }
      return [savedItem, ...current];
    });
    setFilterClientId(savedItem.case.client.id);
    setFeedback(editingId ? "Controle financeiro atualizado." : "Controle financeiro registrado.");
    resetForm();
  }

  async function removeControl(id: string) {
    const confirmed = window.confirm("Deseja realmente excluir este controle financeiro?");
    if (!confirmed) {
      return;
    }

    const response = await fetch(`${getClientApiBaseUrl()}/api/finance/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getTokenFromCookie()}`
      }
    });

    if (!response.ok) {
      setFeedback("Não foi possível excluir o controle financeiro.");
      return;
    }

    setControls((current) => current.filter((item) => item.id !== id));
    setFeedback("Controle financeiro excluído.");
  }

  function startEdit(item: FinancialControlItem) {
    setEditingId(item.id);
    setForm({
      clientId: item.case.client.id,
      caseId: item.case.id,
      minimumWageAmount: String(toMoney(item.minimumWageAmount)),
      projectedBenefitMonths: item.projectedBenefitMonths ? String(item.projectedBenefitMonths) : "",
      plannedInstallments: String(item.plannedInstallments),
      paidInstallments: String(item.paidInstallments),
      arrearsAmount: item.arrearsAmount ? String(toMoney(item.arrearsAmount)) : "",
      arrearsFeePaidAmount: item.arrearsFeePaidAmount ? String(toMoney(item.arrearsFeePaidAmount)) : "",
      notes: item.notes ?? ""
    });
    setFilterClientId(item.case.client.id);
    setFeedback("");
  }

  const isAuxilioDoenca = selectedCase?.benefitType === "AUXILIO_DOENCA";

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Total previsto"
          value={formatMoney(metrics.totalExpected)}
          helper="Parcelas previstas mais honorários sobre atrasados."
          icon={<Calculator className="h-5 w-5" />}
        />
        <MetricCard
          label="Em aberto"
          value={formatMoney(metrics.openInstallments)}
          helper="Saldo parcelado que ainda falta receber."
          icon={<Wallet className="h-5 w-5" />}
        />
        <MetricCard
          label="Já recebido"
          value={formatMoney(metrics.received)}
          helper="Parcelas pagas e o que já entrou dos atrasados."
          icon={<Receipt className="h-5 w-5" />}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <div className="card p-6 md:p-7">
          <p className="eyebrow">{editingId ? "Edição" : "Novo controle"}</p>
          <h2 className="mt-2 text-[1.9rem] font-semibold leading-[1.02] tracking-[-0.03em] text-ink">
            Honorários do caso
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Vincule um caso e deixe o sistema calcular parcelas, atrasados e saldo com base na regra do escritório.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="block text-sm font-medium text-[color:var(--text-soft)]">Cliente</span>
                <select
                  value={form.clientId}
                  onChange={(e) => setForm({ ...form, clientId: e.target.value, caseId: "" })}
                  required
                >
                  <option value="">Selecione o cliente</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.fullName}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <span className="block text-sm font-medium text-[color:var(--text-soft)]">Caso</span>
                <select value={form.caseId} onChange={(e) => setForm({ ...form, caseId: e.target.value })} required>
                  <option value="">Selecione o caso</option>
                  {filteredCases.map((caseItem) => (
                    <option key={caseItem.id} value={caseItem.id}>
                      {caseItem.internalCode} - {formatBenefit(caseItem.benefitType)}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {selectedCase ? (
              <div className="rounded-[22px] border border-[rgba(24,38,63,0.08)] bg-[rgba(248,251,255,0.9)] p-4 text-sm leading-6 text-slate-600">
                <p className="font-semibold text-ink">
                  Regra aplicada: {formatBenefit(selectedCase.benefitType)} via {formatChannel(selectedCase.channelType)}
                </p>
                <p className="mt-1">
                  {isAuxilioDoenca
                    ? "Para auxílio-doença, o número de parcelas acompanha a quantidade de meses do benefício informada abaixo."
                    : selectedCase.channelType === "JUDICIAL"
                      ? "Para benefícios permanentes, BPC e aposentadorias pela via judicial, o sistema calcula 24 parcelas de 30% do salário mínimo."
                      : "Para benefícios permanentes, BPC e aposentadorias pela via administrativa, o sistema calcula 12 parcelas de 30% do salário mínimo."}
                </p>
              </div>
            ) : null}

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="block text-sm font-medium text-[color:var(--text-soft)]">Salário mínimo base</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.minimumWageAmount}
                  onChange={(e) => setForm({ ...form, minimumWageAmount: e.target.value })}
                />
              </label>

              <label className="space-y-2">
                <span className="block text-sm font-medium text-[color:var(--text-soft)]">
                  {isAuxilioDoenca ? "Meses de recebimento do benefício" : "Parcelas previstas"}
                </span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={isAuxilioDoenca ? form.projectedBenefitMonths : form.plannedInstallments}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      [isAuxilioDoenca ? "projectedBenefitMonths" : "plannedInstallments"]: e.target.value
                    })
                  }
                  placeholder={isAuxilioDoenca ? "Ex.: 6" : "Se quiser, ajuste manualmente"}
                />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <label className="space-y-2">
                <span className="block text-sm font-medium text-[color:var(--text-soft)]">Parcelas pagas</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.paidInstallments}
                  onChange={(e) => setForm({ ...form, paidInstallments: e.target.value })}
                />
              </label>

              <label className="space-y-2">
                <span className="block text-sm font-medium text-[color:var(--text-soft)]">Valor dos atrasados</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.arrearsAmount}
                  onChange={(e) => setForm({ ...form, arrearsAmount: e.target.value })}
                />
              </label>

              <label className="space-y-2">
                <span className="block text-sm font-medium text-[color:var(--text-soft)]">Honorários já recebidos dos atrasados</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.arrearsFeePaidAmount}
                  onChange={(e) => setForm({ ...form, arrearsFeePaidAmount: e.target.value })}
                />
              </label>
            </div>

            <label className="space-y-2">
              <span className="block text-sm font-medium text-[color:var(--text-soft)]">Observações financeiras</span>
              <textarea
                className="min-h-[160px]"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Ex.: cliente combinou pagar a primeira parcela após o primeiro crédito do benefício."
              />
            </label>

            <div className="rounded-[22px] border border-[rgba(24,38,63,0.08)] bg-[rgba(248,251,255,0.9)] p-4">
              <p className="text-sm font-semibold text-ink">Resumo calculado</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Valor da parcela</p>
                  <p className="mt-2 text-lg font-semibold text-ink">{formatMoney(preview.installmentValue)}</p>
                </div>
                <div className="rounded-2xl bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Parcelas previstas</p>
                  <p className="mt-2 text-lg font-semibold text-ink">{preview.plannedInstallments}</p>
                </div>
                <div className="rounded-2xl bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Parcelas restantes</p>
                  <p className="mt-2 text-lg font-semibold text-ink">{preview.remainingInstallments}</p>
                </div>
                <div className="rounded-2xl bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Honorários sobre atrasados</p>
                  <p className="mt-2 text-lg font-semibold text-ink">{formatMoney(preview.arrearsFeeValue)}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-white hover:bg-ink/90 disabled:opacity-70"
              >
                {saving ? "Salvando..." : editingId ? "Atualizar controle" : "Registrar controle"}
              </button>
              {editingId ? (
                <button
                  type="button"
                  className="rounded-2xl border border-[rgba(24,38,63,0.12)] bg-white px-5 py-3 text-sm font-semibold text-ink hover:bg-slate-50"
                  onClick={resetForm}
                >
                  Cancelar edição
                </button>
              ) : null}
            </div>

            {feedback ? <p className="text-sm text-[color:var(--text-soft)]">{feedback}</p> : null}
          </form>
        </div>

        <div className="card p-6 md:p-7">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="eyebrow">Controle</p>
              <h2 className="mt-2 text-[1.9rem] font-semibold leading-[1.02] tracking-[-0.03em] text-ink">
                Casos com cobrança
              </h2>
            </div>
            <div className="rounded-2xl border border-[rgba(24,38,63,0.08)] bg-[rgba(248,251,255,0.92)] px-4 py-3 text-sm text-slate-600">
              <Landmark className="mr-2 inline h-4 w-4 align-[-2px]" />
              {visibleControls.length} registro{visibleControls.length === 1 ? "" : "s"}
            </div>
          </div>

          <div className="mt-5">
            <label className="space-y-2">
              <span className="block text-sm font-medium text-[color:var(--text-soft)]">Filtrar por cliente</span>
              <select value={filterClientId} onChange={(e) => setFilterClientId(e.target.value)}>
                <option value="">Todos os clientes</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.fullName}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-6 space-y-4">
            {visibleControls.length ? (
              visibleControls.map((item) => {
                const installmentValue = toMoney(item.installmentValue);
                const arrearsFeeValue = toMoney(item.arrearsFeeValue);
                const pendingInstallments = Math.max(item.plannedInstallments - item.paidInstallments, 0);
                const remainingBalance =
                  installmentValue * pendingInstallments + Math.max(arrearsFeeValue - toMoney(item.arrearsFeePaidAmount), 0);

                return (
                  <div
                    key={item.id}
                    className="rounded-[24px] border border-[rgba(24,38,63,0.08)] bg-[rgba(248,251,255,0.92)] px-5 py-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-lg font-semibold text-ink">{item.case.internalCode}</h3>
                          <span className="rounded-full border border-[rgba(24,38,63,0.08)] bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                            {formatBenefit(item.case.benefitType)}
                          </span>
                          <span className="rounded-full border border-[rgba(24,38,63,0.08)] bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                            {formatChannel(item.case.channelType)}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-slate-600">{item.case.client.fullName}</p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          className="rounded-xl border border-[rgba(24,38,63,0.12)] bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-ink hover:bg-slate-50"
                          onClick={() => startEdit(item)}
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          className="rounded-xl border border-[rgba(140,45,45,0.14)] bg-[rgba(255,242,242,0.95)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[color:#8b3a3a] hover:bg-[rgba(255,235,235,1)]"
                          onClick={() => removeControl(item.id)}
                        >
                          Excluir
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <div className="rounded-2xl bg-white p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Parcelamento</p>
                        <p className="mt-2 text-sm leading-6 text-slate-700">
                          {item.paidInstallments} pagas de {item.plannedInstallments} previstas
                        </p>
                        <p className="mt-1 text-sm leading-6 text-slate-700">Valor da parcela: {formatMoney(item.installmentValue)}</p>
                      </div>
                      <div className="rounded-2xl bg-white p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Atrasados</p>
                        <p className="mt-2 text-sm leading-6 text-slate-700">Base: {formatMoney(item.arrearsAmount)}</p>
                        <p className="mt-1 text-sm leading-6 text-slate-700">Honorários (30%): {formatMoney(item.arrearsFeeValue)}</p>
                      </div>
                      <div className="rounded-2xl bg-white p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Saldo em aberto</p>
                        <p className="mt-2 text-lg font-semibold text-ink">{formatMoney(remainingBalance)}</p>
                      </div>
                      <div className="rounded-2xl bg-white p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Recebido até agora</p>
                        <p className="mt-2 text-lg font-semibold text-ink">
                          {formatMoney(item.paidInstallments * installmentValue + toMoney(item.arrearsFeePaidAmount))}
                        </p>
                      </div>
                    </div>

                    {item.notes ? <p className="mt-4 text-sm leading-6 text-slate-600">{item.notes}</p> : null}
                  </div>
                );
              })
            ) : (
              <div className="rounded-[24px] border border-dashed border-[rgba(24,38,63,0.14)] bg-[rgba(248,251,255,0.7)] px-6 py-8 text-sm leading-7 text-slate-500">
                Nenhum controle financeiro registrado ainda.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
