import { CreateDocumentForm } from "../../components/create-document-form";
import { PageHeader } from "../../components/page-header";
import { apiGet } from "../../lib/api";
import { Client, DocumentItem, CaseItem } from "../../lib/types";

type Category = { id: string; name: string };

export default async function DocumentsPage() {
  const [documents, categories, clients, cases] = await Promise.all([
    apiGet<DocumentItem[]>("/documents"),
    apiGet<Category[]>("/taxonomy/document-categories"),
    apiGet<Client[]>("/clients"),
    apiGet<CaseItem[]>("/cases")
  ]);

  return (
    <div>
      <PageHeader
        title="Documentos"
        description="Repositorio documental com classificacao, origem, metadados juridicos e extracao estruturada preparada para IA."
      />

      <CreateDocumentForm
        categories={categories.map((item) => ({ id: item.id, label: item.name }))}
        clients={clients.map((item) => ({ id: item.id, label: item.fullName }))}
        cases={cases.map((item) => ({ id: item.id, label: item.internalCode }))}
      />

      <div className="card mt-6 overflow-hidden">
        <table className="data-table min-w-full">
          <thead className="bg-[#f7f1e7]">
            <tr>
              <th>Arquivo</th>
              <th>Categoria</th>
              <th>Cliente</th>
              <th>Caso</th>
              <th>Origem</th>
              <th>Conclusao</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((document) => (
              <tr key={document.id}>
                <td>
                  <div className="font-medium">{document.originalFileName}</div>
                  <div className="text-xs text-stone-500">{document.fileName}</div>
                </td>
                <td>{document.category.name}</td>
                <td>{document.client?.fullName || "-"}</td>
                <td>{document.case?.internalCode || "-"}</td>
                <td>{document.origin || "-"}</td>
                <td>{document.extractions?.[0]?.finalConclusion || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
