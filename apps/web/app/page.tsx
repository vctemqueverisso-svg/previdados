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
        description="Visao consolidada dos casos, resultados, doencas, peritos e prazos medios para orientar estrategia administrativa e judicial."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Casos cadastrados" value={data.totals.totalCases} />
        <StatCard label="Clientes" value={data.totals.totalClients} />
        <StatCard label="Peritos" value={data.totals.totalExperts} />
        <StatCard label="Casos exitosos" value={data.totals.successfulCases} hint="Baseado no campo de sucesso final do caso." />
        <StatCard label="Casos sem exito" value={data.totals.unsuccessfulCases} />
        <StatCard label="Media ate a pericia" value={`${data.totals.averageDaysToExpertise} dias`} />
        <StatCard label="Media ate a decisao" value={`${data.totals.averageDaysToDecision} dias`} />
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="card overflow-hidden p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="eyebrow">Sintese executiva</p>
              <h3 className="mt-3 max-w-[12ch] text-[2.2rem] font-semibold leading-[1.05] text-ink">Panorama juridico do escritorio</h3>
              <p className="mt-3 max-w-2xl text-[15px] leading-7 text-slate-600">
                O painel centraliza performance por beneficio, via, doenca e resultado para orientar triagem, estrategia pericial e leitura de risco.
              </p>
            </div>
            <div className="rounded-[22px] border border-[rgba(24,38,63,0.08)] bg-[rgba(233,239,247,0.8)] px-5 py-4 lg:min-w-[13rem]">
              <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">Recorte atual</p>
              <p className="mt-3 text-[2rem] font-semibold leading-[1.05] text-ink">{data.totals.totalCases} casos monitorados</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <p className="eyebrow">Leitura rapida</p>
          <h3 className="mt-3 text-[2rem] font-semibold leading-[1.05] text-ink">Indicadores de decisao</h3>
          <div className="mt-5 space-y-4 text-sm text-slate-600">
            <div className="rounded-[22px] border border-[rgba(24,38,63,0.08)] bg-white/72 px-4 py-4">
              <p className="text-[13px] text-slate-500">Casos com exito</p>
              <p className="mt-2 text-[2.2rem] font-semibold leading-none text-ink">{data.totals.successfulCases}</p>
            </div>
            <div className="rounded-[22px] border border-[rgba(24,38,63,0.08)] bg-white/72 px-4 py-4">
              <p className="text-[13px] text-slate-500">Tempo medio ate decisao</p>
              <p className="mt-2 text-[2.2rem] font-semibold leading-none text-ink">{data.totals.averageDaysToDecision} dias</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-2">
        <div className="card p-6">
          <p className="eyebrow">Distribuicao</p>
          <h3 className="mt-2 text-[2rem] font-semibold leading-[1.05] text-ink">Casos por beneficio</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">Panorama da distribuicao do contencioso previdenciario.</p>
          <SimpleBarChart data={data.byBenefit} />
        </div>

        <div className="card p-6">
          <p className="eyebrow">Comparativo</p>
          <h3 className="mt-2 text-[2rem] font-semibold leading-[1.05] text-ink">Casos por via</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">Comparativo entre administrativo e judicial.</p>
          <SimpleBarChart data={data.byChannel} color="#6f86ac" />
        </div>
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-2">
        <div className="card p-6">
          <p className="eyebrow">Concentracao</p>
          <h3 className="mt-2 text-[2rem] font-semibold leading-[1.05] text-ink">Doencas mais frequentes</h3>
          <SimpleBarChart data={data.byDisease} color="#9f3a38" />
        </div>

        <div className="card p-6">
          <p className="eyebrow">Desempenho</p>
          <h3 className="mt-2 text-[2rem] font-semibold leading-[1.05] text-ink">Exito por doenca</h3>
          <OutcomeChart data={data.outcomeByDisease} />
        </div>
      </section>
    </div>
  );
}
