import { PageHeader } from "../../components/page-header";
import { SimpleBarChart } from "../../components/simple-bar-chart";
import { OutcomeChart } from "../../components/outcome-chart";
import { apiGet } from "../../lib/api";
import { DashboardResponse } from "../../lib/types";

export default async function EstatisticasPage() {
  const data = await apiGet<DashboardResponse>("/dashboard");

  return (
    <div>
      <PageHeader
        title="Estatisticas"
        description="Leitura analitica por doenca, beneficio, perito e desempenho processual para apoiar triagem e estrategia."
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="card p-5">
          <h3 className="text-lg font-semibold text-ink">Distribuicao por perito</h3>
          <SimpleBarChart data={data.byExpert} color="#40513b" />
        </div>
        <div className="card p-5">
          <h3 className="text-lg font-semibold text-ink">Procedencia x improcedencia por doenca</h3>
          <OutcomeChart data={data.outcomeByDisease} />
        </div>
      </div>
    </div>
  );
}

