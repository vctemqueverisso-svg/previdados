import { PageHeader } from "../../components/page-header";
import { CaseRegistry } from "../../components/case-registry";
import { apiGet } from "../../lib/api";
import { CaseItem, Client, Expert } from "../../lib/types";

type TaxonomyItem = { id: string; name?: string; code?: string; description?: string };

export default async function CasesPage({
  searchParams
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const params = new URLSearchParams();
  ["search", "benefitType", "channelType", "outcome"].forEach((key) => {
    const value = resolvedSearchParams[key];
    if (typeof value === "string" && value.length) {
      params.set(key, value);
    }
  });
  const query = params.size ? `?${params.toString()}` : "";
  const lockedClientId = typeof resolvedSearchParams.clientId === "string" ? resolvedSearchParams.clientId : undefined;

  const [cases, clients, diseases, cids, experts] = await Promise.all([
    apiGet<CaseItem[]>(`/cases${query}`),
    apiGet<Client[]>("/clients"),
    apiGet<TaxonomyItem[]>("/taxonomy/diseases"),
    apiGet<TaxonomyItem[]>("/taxonomy/cids"),
    apiGet<Expert[]>("/experts")
  ]);

  return (
    <div>
      <PageHeader
        title="Casos"
        description="Espaco de atendimento e estrategia do cliente, com vinculo ao processo administrativo ou judicial, relato relevante e acompanhamento estruturado."
      />

      <form className="card mb-6 grid gap-3 p-5 md:grid-cols-5">
        <input
          name="search"
          placeholder="Pesquisar por cliente, numero do processo ou codigo interno"
          defaultValue={typeof resolvedSearchParams.search === "string" ? resolvedSearchParams.search : ""}
        />
        <select name="benefitType" defaultValue={typeof resolvedSearchParams.benefitType === "string" ? resolvedSearchParams.benefitType : ""}>
          <option value="">Todos os beneficios</option>
          <option value="AUXILIO_DOENCA">Auxilio-doenca</option>
          <option value="APOSENTADORIA_INCAPACIDADE">Aposentadoria por incapacidade</option>
          <option value="BPC_LOAS">BPC/LOAS</option>
          <option value="OUTRO">Outro</option>
        </select>
        <select name="channelType" defaultValue={typeof resolvedSearchParams.channelType === "string" ? resolvedSearchParams.channelType : ""}>
          <option value="">Todas as vias</option>
          <option value="ADMINISTRATIVO">Administrativo</option>
          <option value="JUDICIAL">Judicial</option>
        </select>
        <select name="outcome" defaultValue={typeof resolvedSearchParams.outcome === "string" ? resolvedSearchParams.outcome : ""}>
          <option value="">Todos os resultados</option>
          <option value="PENDENTE">Pendente</option>
          <option value="DEFERIDO">Deferido</option>
          <option value="INDEFERIDO">Indeferido</option>
          <option value="PROCEDENTE">Procedente</option>
          <option value="IMPROCEDENTE">Improcedente</option>
          <option value="PARCIALMENTE_PROCEDENTE">Parcial procedencia</option>
        </select>
        <button className="rounded-xl bg-gold px-4 py-3 text-sm font-medium text-white hover:bg-gold/90">Filtrar</button>
      </form>

      <CaseRegistry
        initialCases={cases}
        clients={clients.map((item) => ({ id: item.id, label: item.fullName }))}
        diseases={diseases.map((item) => ({ id: item.id, label: item.name || "" }))}
        cids={cids.map((item) => ({ id: item.id, label: `${item.code} - ${item.description}` }))}
        experts={experts.map((item) => ({ id: item.id, label: item.fullName }))}
        lockedClientId={lockedClientId}
      />
    </div>
  );
}
