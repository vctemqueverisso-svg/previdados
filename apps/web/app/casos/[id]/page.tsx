import Link from "next/link";
import { PageHeader } from "../../../components/page-header";
import { apiGet } from "../../../lib/api";

type CaseDetail = {
  id: string;
  internalCode: string;
  caseNumber?: string;
  channelType: string;
  benefitType: string;
  currentStatus: string;
  protocolDate?: string;
  derDate?: string;
  expertExamDate?: string;
  decisionDate?: string;
  strategySummary?: string;
  courtAgencyName?: string;
  courtDivision?: string;
  urgentReliefRequested: boolean;
  profession?: string;
  educationLevel?: string;
  ageAtFiling?: number;
  familyIncome?: string;
  familyGroupDescription?: string;
  client: { id: string; fullName: string; cpf: string; city?: string; state?: string };
  mainDisease?: { name: string };
  mainCid?: { code: string; description: string };
  secondaryCids: { cid: { code: string; description: string } }[];
  expert?: { fullName: string; specialty?: string };
  documents: { id: string; originalFileName: string; category: { name: string } }[];
  proceduralEvents: { id: string; eventType: string; eventDate: string; description?: string }[];
  internalNotes: {
    id: string;
    strengthOfMedicalEvidence?: string;
    mainObstacle?: string;
    mainThesis?: string;
    secondaryThesis?: string;
    hearingExamNotes?: string;
    estimatedRisk?: string;
    reasonForDenial?: string;
    decisionCentralGround?: string;
    privateNote?: string;
  }[];
  result?: {
    administrativeResult?: string;
    judicialResult?: string;
    finalOutcome?: string;
    outcomeReason?: string;
    decisionSummary?: string;
    successFlag?: boolean;
  };
};

const tabs = [
  ["resumo", "Resumo"],
  ["documentos", "Documentos"],
  ["historico", "Historico"],
  ["pericias", "Pericias"],
  ["estrategia", "Atendimento e estrategia"],
  ["resultado", "Resultado"],
  ["estatisticas", "Estatisticas relacionadas"]
] as const;

export default async function CaseDetailPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const resolvedSearchParams = (await searchParams) ?? {};
  const tab = typeof resolvedSearchParams.tab === "string" ? resolvedSearchParams.tab : "resumo";
  const data = await apiGet<CaseDetail>(`/cases/${id}`);
  const milestoneEvents = [
    data.derDate ? { id: "der", eventType: "DER", eventDate: data.derDate, description: "Data de entrada do requerimento." } : null,
    data.protocolDate ? { id: "protocolo-base", eventType: "PROTOCOLO", eventDate: data.protocolDate, description: "Marco principal do protocolo do caso." } : null,
    data.expertExamDate
      ? {
          id: "pericia-base",
          eventType: data.channelType === "JUDICIAL" ? "PERÍCIA JUDICIAL" : "PERÍCIA ADMINISTRATIVA",
          eventDate: data.expertExamDate,
          description: "Data principal da perícia considerada para acompanhamento e estatística."
        }
      : null,
    data.decisionDate ? { id: "decisao-base", eventType: "DECISÃO", eventDate: data.decisionDate, description: "Data principal da decisão do caso." } : null
  ].filter(Boolean) as { id: string; eventType: string; eventDate: string; description?: string }[];

  const timeline = [...milestoneEvents, ...data.proceduralEvents]
    .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());

  return (
    <div>
      <PageHeader
        title={`Caso ${data.internalCode}`}
        description={`${data.client.fullName} | ${data.channelType} | ${data.benefitType} | ${data.currentStatus}`}
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map(([key, label]) => (
          <Link
            key={key}
            href={`/casos/${id}?tab=${key}`}
            className={`rounded-full px-4 py-2 text-sm ${tab === key ? "bg-ink text-white" : "bg-white text-stone-600"}`}
          >
            {label}
          </Link>
        ))}
      </div>

      {tab === "resumo" ? (
        <div className="grid gap-6 xl:grid-cols-2">
          <section className="card p-5">
            <h3 className="text-lg font-semibold">Dados principais</h3>
            <dl className="mt-4 space-y-3 text-sm text-stone-700">
              <div>
                <dt className="font-medium">Numero</dt>
                <dd>{data.caseNumber || "-"}</dd>
              </div>
              <div>
                <dt className="font-medium">Doenca principal</dt>
                <dd>{data.mainDisease?.name || "-"}</dd>
              </div>
              <div>
                <dt className="font-medium">CID principal</dt>
                <dd>{data.mainCid ? `${data.mainCid.code} - ${data.mainCid.description}` : "-"}</dd>
              </div>
              <div>
                <dt className="font-medium">CIDs complementares</dt>
                <dd>
                  {data.secondaryCids.length
                    ? data.secondaryCids.map((item) => `${item.cid.code} - ${item.cid.description}`).join(" | ")
                    : "-"}
                </dd>
              </div>
              <div>
                <dt className="font-medium">Perito</dt>
                <dd>{data.expert?.fullName || "-"}</dd>
              </div>
              <div>
                <dt className="font-medium">Orgao</dt>
                <dd>{[data.courtAgencyName, data.courtDivision].filter(Boolean).join(" / ") || "-"}</dd>
              </div>
            </dl>
          </section>

          <section className="card p-5">
            <h3 className="text-lg font-semibold">Perfil do cliente</h3>
            <dl className="mt-4 space-y-3 text-sm text-stone-700">
              <div>
                <dt className="font-medium">Cliente</dt>
                <dd>
                  <Link href={`/clientes/${data.client.id}`} className="text-ink hover:text-gold">
                    {data.client.fullName}
                  </Link>
                </dd>
              </div>
              <div>
                <dt className="font-medium">CPF</dt>
                <dd>{data.client.cpf}</dd>
              </div>
              <div>
                <dt className="font-medium">Profissao</dt>
                <dd>{data.profession || "-"}</dd>
              </div>
              <div>
                <dt className="font-medium">Escolaridade</dt>
                <dd>{data.educationLevel || "-"}</dd>
              </div>
              <div>
                <dt className="font-medium">Idade no pedido</dt>
                <dd>{data.ageAtFiling || "-"}</dd>
              </div>
            </dl>
          </section>
        </div>
      ) : null}

      {tab === "documentos" ? (
        <section className="card p-5">
          <h3 className="text-lg font-semibold">Documentos vinculados</h3>
          <div className="mt-4 space-y-3">
            {data.documents.length ? (
              data.documents.map((item) => (
                <div key={item.id} className="rounded-xl border border-stone-200 px-4 py-3 text-sm">
                  <div className="font-medium">{item.originalFileName}</div>
                  <div className="text-stone-500">{item.category.name}</div>
                </div>
              ))
            ) : (
              <p className="text-sm text-stone-500">Nenhum documento vinculado.</p>
            )}
          </div>
        </section>
      ) : null}

      {tab === "historico" ? (
        <section className="card p-5">
          <h3 className="text-lg font-semibold">Linha do tempo processual</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-4">
            <div className="rounded-2xl border border-stone-200 px-4 py-3 text-sm">
              <div className="font-medium">DER</div>
              <div className="text-stone-500">{data.derDate ? new Date(data.derDate).toLocaleDateString("pt-BR") : "-"}</div>
            </div>
            <div className="rounded-2xl border border-stone-200 px-4 py-3 text-sm">
              <div className="font-medium">Protocolo</div>
              <div className="text-stone-500">{data.protocolDate ? new Date(data.protocolDate).toLocaleDateString("pt-BR") : "-"}</div>
            </div>
            <div className="rounded-2xl border border-stone-200 px-4 py-3 text-sm">
              <div className="font-medium">Perícia</div>
              <div className="text-stone-500">{data.expertExamDate ? new Date(data.expertExamDate).toLocaleDateString("pt-BR") : "-"}</div>
            </div>
            <div className="rounded-2xl border border-stone-200 px-4 py-3 text-sm">
              <div className="font-medium">Decisão</div>
              <div className="text-stone-500">{data.decisionDate ? new Date(data.decisionDate).toLocaleDateString("pt-BR") : "-"}</div>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {timeline.length ? (
              timeline.map((item) => (
                <div key={item.id} className="rounded-xl border border-stone-200 px-4 py-3 text-sm">
                  <div className="font-medium">{item.eventType}</div>
                  <div className="text-stone-500">{new Date(item.eventDate).toLocaleDateString("pt-BR")}</div>
                  <div>{item.description || "-"}</div>
                </div>
              ))
            ) : (
              <p className="text-sm text-stone-500">Nenhum evento registrado.</p>
            )}
          </div>
        </section>
      ) : null}

      {tab === "pericias" ? (
        <section className="card p-5 text-sm text-stone-700">
          <h3 className="text-lg font-semibold">Pericias</h3>
          <p className="mt-4">Perito: {data.expert?.fullName || "-"}</p>
          <p>Especialidade: {data.expert?.specialty || "-"}</p>
          <p>Tutela de urgencia: {data.urgentReliefRequested ? "Sim" : "Nao"}</p>
        </section>
      ) : null}

      {tab === "estrategia" ? (
        <section className="card p-5">
          <h3 className="text-lg font-semibold">Atendimento e estrategia</h3>
          <div className="mt-4 space-y-3 text-sm text-stone-700">
            <p><strong>Síntese do atendimento:</strong> {data.strategySummary || "-"}</p>
            <p><strong>Forca da prova:</strong> {data.internalNotes[0]?.strengthOfMedicalEvidence || "-"}</p>
            <p><strong>Obstaculo principal:</strong> {data.internalNotes[0]?.mainObstacle || "-"}</p>
            <p><strong>Tese principal:</strong> {data.internalNotes[0]?.mainThesis || "-"}</p>
            <p><strong>Tese subsidiaria:</strong> {data.internalNotes[0]?.secondaryThesis || "-"}</p>
            <p><strong>Observacoes para audiencia/pericia:</strong> {data.internalNotes[0]?.hearingExamNotes || "-"}</p>
            <p><strong>Risco estimado:</strong> {data.internalNotes[0]?.estimatedRisk || "-"}</p>
          </div>
        </section>
      ) : null}

      {tab === "resultado" ? (
        <section className="card p-5">
          <h3 className="text-lg font-semibold">Resultado</h3>
          <div className="mt-4 space-y-3 text-sm text-stone-700">
            <p><strong>Administrativo:</strong> {data.result?.administrativeResult || "-"}</p>
            <p><strong>Judicial:</strong> {data.result?.judicialResult || "-"}</p>
            <p><strong>Final:</strong> {data.result?.finalOutcome || "-"}</p>
            <p><strong>Motivo:</strong> {data.result?.outcomeReason || "-"}</p>
            <p><strong>Fundamento:</strong> {data.result?.decisionSummary || "-"}</p>
          </div>
        </section>
      ) : null}

      {tab === "estatisticas" ? (
        <section className="card p-5 text-sm text-stone-700">
          <h3 className="text-lg font-semibold">Estatisticas relacionadas</h3>
          <p className="mt-4">A base esta preparada para cruzar este caso com desempenho por perito, doenca, CID, faixa etaria e via.</p>
          <p className="mt-2">No MVP atual, esses indicadores consolidados estao disponiveis no dashboard e na area de estatisticas.</p>
        </section>
      ) : null}
    </div>
  );
}
