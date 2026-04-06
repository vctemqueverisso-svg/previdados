import { PageHeader } from "../../../components/page-header";
import { apiGet } from "../../../lib/api";
import { Expert } from "../../../lib/types";

export default async function ExpertDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const expert = await apiGet<Expert>(`/experts/${id}`);

  return (
    <div>
      <PageHeader
        title={expert.fullName}
        description={`Análise pericial com foco em especialidade, volume de casos e taxa de êxito associada.`}
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="card p-5 text-sm text-stone-700">
          <h3 className="text-lg font-semibold">Resumo do perito</h3>
          <p className="mt-4"><strong>Especialidade:</strong> {expert.specialty || "-"}</p>
          <p><strong>Local:</strong> {[expert.city, expert.state].filter(Boolean).join("/") || "-"}</p>
          <p><strong>Total de casos:</strong> {expert.analytics?.totalCases || 0}</p>
          <p><strong>Conclusoes favoraveis:</strong> {expert.analytics?.favorableCases || 0}</p>
          <p><strong>Conclusoes desfavoraveis:</strong> {expert.analytics?.unfavorableCases || 0}</p>
          <p><strong>Taxa de exito:</strong> {expert.analytics?.successRate || 0}%</p>
        </section>

        <section className="card p-5">
          <h3 className="text-lg font-semibold">Doencas mais avaliadas</h3>
          <div className="mt-4 space-y-3 text-sm text-stone-700">
            {expert.analytics?.diseases?.map((item) => (
              <div key={item.name} className="rounded-xl border border-stone-200 px-4 py-3">
                <div className="font-medium">{item.name}</div>
                <div className="text-stone-500">{item.total} caso(s)</div>
              </div>
            )) || <p>Nenhum caso vinculado ate o momento.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}
