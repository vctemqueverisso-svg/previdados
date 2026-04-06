import { AttendanceRegistry } from "../../components/attendance-registry";
import { PageHeader } from "../../components/page-header";
import { apiGet } from "../../lib/api";
import { AttendanceItem, CaseItem, Client } from "../../lib/types";

export default async function AttendimentosPage({
  searchParams
}: {
  searchParams?: Promise<{ clientId?: string }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const lockedClientId = resolvedSearchParams?.clientId;

  const [attendances, clients, cases] = await Promise.all([
    apiGet<AttendanceItem[]>("/attendances"),
    apiGet<Client[]>("/clients"),
    apiGet<CaseItem[]>("/cases")
  ]);

  return (
    <div>
      <PageHeader
        title="Atendimentos"
        description="Registro das consultas, retornos, estratégias e próximos passos combinados com cada cliente."
      />

      <AttendanceRegistry initialAttendances={attendances} clients={clients} cases={cases} lockedClientId={lockedClientId} />
    </div>
  );
}
