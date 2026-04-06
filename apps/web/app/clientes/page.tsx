import { PageHeader } from "../../components/page-header";
import { ClientRegistry } from "../../components/client-registry";
import { apiGet } from "../../lib/api";
import { Client } from "../../lib/types";

export default async function ClientesPage() {
  const clients = await apiGet<Client[]>("/clients");

  return (
    <div>
      <PageHeader
        title="Clientes"
        description="Cadastro e consulta dos segurados com histórico de casos, dados cadastrais e vínculos documentais."
      />

      <ClientRegistry initialClients={clients} />
    </div>
  );
}
