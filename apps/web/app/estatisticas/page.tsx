import Link from "next/link";
import { OutcomeChart } from "../../components/outcome-chart";
import { SimpleBarChart } from "../../components/simple-bar-chart";
import { StatCard } from "../../components/stat-card";
import { apiGet } from "../../lib/api";
import { DashboardResponse } from "../../lib/types";

export default async function EstatisticasPage() {
  const data = await apiGet<DashboardResponse>("/dashboard");

  return (
    <div className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="card p-7">
          <p className="eyebrow">Estatisticas</p>
          <h1 className="mt-3 max-w-4xl text-[2.45rem] font-semibold leading-[0.96] tracking-[-0.04em] text-ink md:text-[3.4rem]">
            Controle da carteira, dos atendimentos e do andamento processual em um unico painel.
          </h1>
          <p className="mt-4 max-w-3xl text-[15px] leading-7 text-slate-600">
            Aqui voce acompanha os indicadores do escritorio e enxerga com mais clareza os resultados, os tempos medios e o perfil da carteira.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/clientes"
              className="rounded-2xl bg-ink px-5 py-3 text-sm font-medium text-white shadow-[0_16px_32px_rgba(16,27,46,0.16)] hover:bg-ink/90"
            >
              Ver clientes
            </Link>
            <Link
              href="/atendimentos"
              className="rounded-2xl border border-[rgba(24,38,63,0.12)] bg-white px-5 py-3 text-sm font-medium text-ink hover:bg-slate-50"
            >
              Abrir atendimentos
            </Link>
            <Link
              href="/casos"
              className="rounded-2xl border border-[rgba(24,38,63,0.12)] bg-white px-5 py-3 text-sm font-medium text-ink hover:bg-slate-50"
            >
              Acompanhar casos
            </Link>
          </div>
        </div>

        <div className="card p-7">
          <p className="eyebrow">Leitura imediata</p>
          <div className="mt-5 grid gap-4">
            <div className="rounded-[24px] border border-[rgba(24,38,63,0.08)] bg-[linear-gradient(180deg,rgba(21,34,56,0.98),rgba(17,28,46,0.98))] px-5 py-5 text-white">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-300">Base ativa</p>
              <p className="mt-3 text-[2.4rem] font-semibold leading-none">{data.totals.totalClients}</p>
              <p className="mt-3 text-sm leading-6 text-slate-200">Clientes com cadastro pronto para atendimento, estrategia e vinculacao de casos.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[24px] border border-[rgba(24,38,63,0.08)] bg-[rgba(248,251,255,0.92)] px-5 py-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Pericia</p>
                <p className="mt-3 text-[2rem] font-semibold leading-none text-ink">{data.totals.averageDaysToExpertise} dias</p>
                <p className="mt-3 text-sm text-slate-600">Tempo medio ate a pericia.</p>
              </div>
              <div className="rounded-[24px] border border-[rgba(24,38,63,0.08)] bg-[rgba(248,251,255,0.92)] px-5 py-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Decisao</p>
                <p className="mt-3 text-[2rem] font-semibold leading-none text-ink">{data.totals.averageDaysToDecision} dias</p>
                <p className="mt-3 text-sm text-slate-600">Tempo medio ate a decisao.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Clientes" value={data.totals.totalClients} />
        <StatCard label="Procedentes" value={data.totals.successfulCases} hint="Com base no resultado final do caso." />
        <StatCard label="Improcedentes" value={data.totals.unsuccessfulCases} />
        <StatCard label="Media ate a decisao" value={`${data.totals.averageDaysToDecision} dias`} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <div className="card p-6">
          <p className="eyebrow">Gestao da carteira</p>
          <h2 className="mt-2 text-[2rem] font-semibold leading-[1.02] tracking-[-0.03em] text-ink">Quadro de desempenho</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Visao compacta para saber rapidamente como a carteira esta performando e onde voce pode concentrar esforco.
          </p>

          <div className="mt-6 space-y-4">
            <div className="rounded-[24px] border border-[rgba(24,38,63,0.08)] bg-[rgba(248,251,255,0.92)] px-5 py-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Procedencia</p>
              <p className="mt-3 text-[2.3rem] font-semibold leading-none text-ink">{data.totals.successfulCases}</p>
              <p className="mt-3 text-sm text-slate-600">Casos com desfecho favoravel no resultado final registrado.</p>
            </div>
            <div className="rounded-[24px] border border-[rgba(24,38,63,0.08)] bg-[rgba(248,251,255,0.92)] px-5 py-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Improcedencia</p>
              <p className="mt-3 text-[2.3rem] font-semibold leading-none text-ink">{data.totals.unsuccessfulCases}</p>
              <p className="mt-3 text-sm text-slate-600">Casos com desfecho desfavoravel, relevantes para leitura de risco e tese.</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <p className="eyebrow">Carteira ativa</p>
          <h2 className="mt-2 text-[2rem] font-semibold leading-[1.02] tracking-[-0.03em] text-ink">Casos por beneficio</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">Distribuicao da carteira para leitura rapida do perfil de atendimento do escritorio.</p>
          <SimpleBarChart data={data.byBenefit} />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="card p-6">
          <p className="eyebrow">Fluxo</p>
          <h2 className="mt-2 text-[2rem] font-semibold leading-[1.02] tracking-[-0.03em] text-ink">Casos por via</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">Comparacao entre a frente administrativa e a judicial para acompanhar o perfil do contencioso.</p>
          <SimpleBarChart data={data.byChannel} color="#6f86ac" />
        </div>

        <div className="card p-6">
          <p className="eyebrow">Resultado</p>
          <h2 className="mt-2 text-[2rem] font-semibold leading-[1.02] tracking-[-0.03em] text-ink">Exito por doenca</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">Comparativo entre desfechos favoraveis e desfavoraveis por quadro patologico registrado.</p>
          <OutcomeChart data={data.outcomeByDisease} />
        </div>
      </section>
    </div>
  );
}
