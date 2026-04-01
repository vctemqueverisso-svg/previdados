import { PageHeader } from "../components/page-header";
import { StatCard } from "../components/stat-card";
import { SimpleBarChart } from "../components/simple-bar-chart";
import { OutcomeChart } from "../components/outcome-chart";
import { apiGet } from "../lib/api";
import { DashboardResponse } from "../lib/types";

export default async function DashboardPage() {
  const data = await apiGet<DashboardResponse>("/dashboard");

  return (
    <div>
      <PageHeader
        title="PREVIDADOS"
        description="Visão consolidada de casos, resultados, doenças, peritos e prazos médios para orientar a estratégia administrativa e judicial."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Casos cadastrados" value={data.totals.totalCases} />
        <StatCard label="Clientes" value={data.totals.totalClients} />
        <StatCard label="Peritos" value={data.totals.totalExperts} />
        <StatCard label="Casos exitosos" value={data.totals.successfulCases} hint="Baseado no campo de sucesso final do caso." />
        <StatCard label="Casos sem êxito" value={data.totals.unsuccessfulCases} />
        <StatCard label="Média até a perícia" value={`${data.totals.averageDaysToExpertise} dias`} />
        <StatCard label="Média até a decisão" value={`${data.totals.averageDaysToDecision} dias`} />
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="card overflow-hidden p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="eyebrow">Síntese executiva</p>
              <h3 className="mt-3 max-w-[12ch] text-[2.2rem] font-semibold leading-[1.02] tracking-[-0.03em] text-ink">Panorama jurídico do escritório</h3>
              <p className="mt-3 max-w-2xl text-[15px] leading-7 text-slate-600">
                O painel centraliza desempenho por benefício, via, doença e resultado para orientar triagem, estratégia pericial e leitura de risco.
              </p>
            </div>
            <div className="rounded-[24px] border border-[rgba(24,38,63,0.08)] bg-[linear-gradient(180deg,rgba(233,239,247,0.95),rgba(244,247,251,0.82))] px-5 py-4 lg:min-w-[13rem]">
              <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">Recorte atual</p>
              <p className="mt-3 text-[2rem] font-semibold leading-[1.05] text-ink">{data.totals.totalCases} casos monitorados</p>
            </div>
          </div>
        </div>

        <div className="card p-7">
          <p className="eyebrow">Leitura rápida</p>
          <h3 className="mt-3 text-[2rem] font-semibold leading-[1.02] tracking-[-0.03em] text-ink">Indicadores de decisão</h3>
          <div className="mt-5 space-y-4 text-sm text-slate-600">
            <div className="rounded-[24px] border border-[rgba(24,38,63,0.08)] bg-white/78 px-5 py-4">
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-slate-500">Casos com êxito</p>
              <p className="mt-2 text-[2.2rem] font-semibold leading-none text-ink">{data.totals.successfulCases}</p>
            </div>
            <div className="rounded-[24px] border border-[rgba(24,38,63,0.08)] bg-white/78 px-5 py-4">
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-slate-500">Tempo médio até decisão</p>
              <p className="mt-2 text-[2.2rem] font-semibold leading-none text-ink">{data.totals.averageDaysToDecision} dias</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-2">
        <div className="card p-6">
          <p className="eyebrow">Distribuição</p>
          <h3 className="mt-2 text-[2rem] font-semibold leading-[1.02] tracking-[-0.03em] text-ink">Casos por benefício</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">Panorama da distribuição do contencioso previdenciário.</p>
          <SimpleBarChart data={data.byBenefit} />
        </div>

        <div className="card p-6">
          <p className="eyebrow">Comparativo</p>
          <h3 className="mt-2 text-[2rem] font-semibold leading-[1.02] tracking-[-0.03em] text-ink">Casos por via</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">Comparativo entre administrativo e judicial.</p>
          <SimpleBarChart data={data.byChannel} color="#6f86ac" />
        </div>
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-2">
        <div className="card p-6">
          <p className="eyebrow">Concentração</p>
          <h3 className="mt-2 text-[2rem] font-semibold leading-[1.02] tracking-[-0.03em] text-ink">Doenças mais frequentes</h3>
          <SimpleBarChart data={data.byDisease} color="#9f3a38" />
        </div>

        <div className="card p-6">
          <p className="eyebrow">Desempenho</p>
          <h3 className="mt-2 text-[2rem] font-semibold leading-[1.02] tracking-[-0.03em] text-ink">Êxito por doença</h3>
          <OutcomeChart data={data.outcomeByDisease} />
        </div>
      </section>
    </div>
  );
}
