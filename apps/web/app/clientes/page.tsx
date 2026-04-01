import { PageHeader } from "../../components/page-header";
import { CreateClientForm } from "../../components/create-client-form";
import { apiGet } from "../../lib/api";
import { Client } from "../../lib/types";

export default async function ClientesPage() {
  const clients = await apiGet<Client[]>("/clients");

  return (
    <div>
      <PageHeader
        title="Clientes"
        description="Cadastro e consulta dos segurados com historico de casos, dados cadastrais e vinculos documentais."
      />

      <CreateClientForm />

      <div className="card mt-6 overflow-hidden">
        <table className="data-table min-w-full">
          <thead className="bg-[#f7f1e7]">
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>Contato</th>
              <th>Cidade/UF</th>
              <th>Casos</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id}>
                <td className="font-medium">{client.fullName}</td>
                <td>{client.cpf}</td>
                <td>{client.phone || client.email || "-"}</td>
                <td>{[client.city, client.state].filter(Boolean).join("/") || "-"}</td>
                <td>{client.cases?.length ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
