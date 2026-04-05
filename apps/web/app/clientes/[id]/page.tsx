import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "../../../components/page-header";
import { apiGet } from "../../../lib/api";

type ClientDetail = {
  id: string;
  fullName: string;
  cpf: string;
  birthDate: string;
  gender: string;
  phone?: string;
  email?: string;
  zipCode?: string;
  street?: string;
  addressNumber?: string;
  neighborhood?: string;
  complement?: string;
  city?: string;
  state?: string;
  notes?: string;
  attendances: {
    id: string;
    title: string;
    kind: string;
    attendanceDate: string;
    ownerName?: string;
    contactChannel?: string;
    summary?: string;
    clientReport?: string;
    requestedDocuments?: string;
    case?: {
      id: string;
      internalCode: string;
    } | null;
  }[];
  cases: {
    id: string;
    internalCode: string;
    benefitType: string;
    channelType: string;
    currentStatus: string;
    strategySummary?: string;
    profession?: string;
    educationLevel?: string;
    result?: {
      finalOutcome?: string;
    } | null;
    expert?: {
      fullName: string;
    } | null;
  }[];
  documents: {
    id: string;
    originalFileName: string;
    category: {
      name: string;
    };
  }[];
};

function formatAddress(data: ClientDetail) {
  const streetLine = [data.street, data.addressNumber].filter(Boolean).join(", ");
  const districtLine = [data.neighborhood, data.city, data.state].filter(Boolean).join(" - ");
  const supportLine = [data.complement, data.zipCode ? `CEP ${data.zipCode}` : ""].filter(Boolean).join(" | ");

  return [streetLine, districtLine, supportLine].filter(Boolean).join(" / ");
}

function formatGender(value?: string) {
  switch (value) {
    case "FEMININO":
      return "Feminino";
    case "MASCULINO":
      return "Masculino";
    case "OUTRO":
      return "Outro";
    default:
      return "Nao informado";
  }
}

function formatBenefit(value: string) {
  switch (value) {
    case "AUXILIO_DOENCA":
      return "Auxilio-doenca";
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

function formatAttendanceKind(value: string) {
  switch (value) {
    case "CONSULTA_INICIAL":
      return "Consulta inicial";
    case "RETORNO":
      return "Retorno";
    case "TRIAGEM_DOCUMENTAL":
      return "Triagem documental";
    case "ESTRATEGIA_PROCESSUAL":
      return "Estrategia processual";
    case "POS_DECISAO":
      return "Pos-decisao";
    default:
      return "Atendimento";
  }
}

export default async function ClientDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let client: ClientDetail | null = null;

  try {
    client = await apiGet<ClientDetail>(`/clients/${id}`);
  } catch {
    notFound();
  }

  if (!client) {
    notFound();
  }

  return (
    <div>
      <PageHeader
        title={client.fullName}
        description="Ficha cadastral consolidada do cliente, com contato, endereco, documentos, atendimentos e historico processual."
      />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="card p-6">
          <p className="eyebrow">Cadastro</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">CPF</p>
              <p className="mt-2 text-sm text-slate-700">{client.cpf}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Nascimento</p>
              <p className="mt-2 text-sm text-slate-700">{new Date(client.birthDate).toLocaleDateString("pt-BR")}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Genero</p>
              <p className="mt-2 text-sm text-slate-700">{formatGender(client.gender)}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Contato</p>
              <p className="mt-2 text-sm text-slate-700">{client.phone || client.email || "-"}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Endereco</p>
              <p className="mt-2 text-sm text-slate-700">{formatAddress(client) || "Endereco nao informado."}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Observacoes cadastrais</p>
              <p className="mt-2 text-sm leading-6 text-slate-700">{client.notes || "Sem observacoes no cadastro."}</p>
            </div>
          </div>
        </section>

        <section className="card p-6">
          <p className="eyebrow">Visao rapida</p>
          <div className="mt-4 space-y-4">
            <div className="rounded-2xl border border-[rgba(24,38,63,0.08)] bg-[rgba(250,252,255,0.85)] px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Casos vinculados</p>
              <p className="mt-3 metric-value text-[2.25rem] text-ink">{client.cases.length}</p>
            </div>
            <div className="rounded-2xl border border-[rgba(24,38,63,0.08)] bg-[rgba(250,252,255,0.85)] px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Atendimentos realizados</p>
              <p className="mt-3 metric-value text-[2.25rem] text-ink">{client.attendances.length}</p>
            </div>
            <div className="rounded-2xl border border-[rgba(24,38,63,0.08)] bg-[rgba(250,252,255,0.85)] px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Documentos vinculados</p>
              <p className="mt-3 metric-value text-[2.25rem] text-ink">{client.documents.length}</p>
            </div>
          </div>
        </section>
      </div>

      <section className="card mt-6 p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Atendimentos</p>
            <h3 className="mt-2 text-2xl font-semibold text-ink">Historico de consultas e estrategia</h3>
            <p className="mt-2 text-sm text-[color:var(--text-soft)]">
              Aqui ficam os registros de conversa, orientacoes, estrategia juridica, documentos solicitados e proximos passos combinados com o cliente.
            </p>
          </div>
          <Link
            href={`/atendimentos?clientId=${client.id}`}
            className="rounded-xl border border-[rgba(24,38,63,0.12)] bg-white px-4 py-3 text-sm font-medium text-ink hover:bg-slate-50"
          >
            Novo atendimento para este cliente
          </Link>
        </div>

        <div className="mt-6 space-y-4">
          {client.attendances.length ? (
            client.attendances.map((item) => (
              <div key={item.id} className="rounded-[24px] border border-[rgba(24,38,63,0.08)] bg-[rgba(250,252,255,0.82)] p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-ink">
                      {formatAttendanceKind(item.kind)} - {new Date(item.attendanceDate).toLocaleDateString("pt-BR")}
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      {item.ownerName ? `Responsavel: ${item.ownerName}` : "Responsavel nao informado"}
                    </p>
                  </div>
                  <div className="rounded-full bg-[rgba(24,38,63,0.06)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
                    {item.case ? `Caso ${item.case.internalCode}` : "Sem caso vinculado"}
                  </div>
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Relato do cliente</p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{item.clientReport || "Relato ainda nao registrado."}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Documentos pendentes</p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{item.requestedDocuments || "Nenhum documento pendente registrado."}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-600">Este cliente ainda nao possui atendimentos registrados.</p>
          )}
        </div>
      </section>

      <section className="card mt-6 p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Casos</p>
            <h3 className="mt-2 text-2xl font-semibold text-ink">Historico processual</h3>
            <p className="mt-2 text-sm text-[color:var(--text-soft)]">
              Cada caso concentra o andamento administrativo ou judicial, a linha do tempo processual e a estrategia aplicada.
            </p>
          </div>
          <Link href={`/casos?clientId=${client.id}`} className="rounded-xl border border-[rgba(24,38,63,0.12)] bg-white px-4 py-3 text-sm font-medium text-ink hover:bg-slate-50">
            Ir para casos
          </Link>
        </div>

        <div className="mt-6 space-y-4">
          {client.cases.length ? (
            client.cases.map((item) => (
              <div key={item.id} className="rounded-[24px] border border-[rgba(24,38,63,0.08)] bg-[rgba(250,252,255,0.82)] p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <Link href={`/casos/${item.id}`} className="text-lg font-semibold text-ink hover:text-gold">
                      {item.internalCode}
                    </Link>
                    <p className="mt-2 text-sm text-slate-600">
                      {formatBenefit(item.benefitType)} | {formatChannel(item.channelType)} | {item.currentStatus}
                    </p>
                  </div>
                  <div className="rounded-full bg-[rgba(24,38,63,0.06)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
                    {item.result?.finalOutcome || "Em andamento"}
                  </div>
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Profissao</p>
                    <p className="mt-2 text-sm text-slate-700">{item.profession || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Escolaridade</p>
                    <p className="mt-2 text-sm text-slate-700">{item.educationLevel || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Perito</p>
                    <p className="mt-2 text-sm text-slate-700">{item.expert?.fullName || "Nao definido"}</p>
                  </div>
                  <div className="md:col-span-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Sintese da estrategia</p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{item.strategySummary || "Estrategia ainda nao registrada."}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-600">Este cliente ainda nao possui casos vinculados.</p>
          )}
        </div>
      </section>

      <section className="card mt-6 p-6">
        <p className="eyebrow">Documentos</p>
        <h3 className="mt-2 text-2xl font-semibold text-ink">Acervo documental</h3>
        <div className="mt-6 space-y-3">
          {client.documents.length ? (
            client.documents.map((item) => (
              <div key={item.id} className="rounded-2xl border border-[rgba(24,38,63,0.08)] px-4 py-4 text-sm text-slate-700">
                <p className="font-medium text-ink">{item.originalFileName}</p>
                <p className="mt-1 text-slate-500">{item.category.name}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-600">Nenhum documento vinculado a este cliente.</p>
          )}
        </div>
      </section>
    </div>
  );
}
