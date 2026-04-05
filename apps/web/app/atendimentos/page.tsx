import { AttendanceRegistry } from "../../components/attendance-registry";
import { PageHeader } from "../../components/page-header";
import { apiGet } from "../../lib/api";
import { AttendanceItem, CaseItem, Client } from "../../lib/types";

export default async function AttendimentosPage() {
  const [attendances, clients, cases] = await Promise.all([
    apiGet<AttendanceItem[]>("/attendances"),
    apiGet<Client[]>("/clients"),
    apiGet<CaseItem[]>("/cases")
  ]);

  return (
    <div>
      <PageHeader
        title="Atendimentos"
        description="Registro das consultas, retornos, estrategias e proximos passos combinados com cada cliente."
      />

      <AttendanceRegistry initialAttendances={attendances} clients={clients} cases={cases} />
    </div>
  );
}
