import { PageHeader } from "../../components/page-header";

const measures = [
  "Autenticacao baseada em JWT e rotas protegidas na API.",
  "Separacao entre dados do caso, metadados documentais e notas internas.",
  "Base preparada para logs de acesso e auditoria por entidade.",
  "Armazenamento de arquivos fora do banco, com chave de storage dedicada.",
  "Arquitetura pronta para perfis de acesso por papel e módulos sensíveis.",
  "Estrutura de dados adequada para trilha LGPD e revisao de acessos."
];

export default function SegurancaPage() {
  return (
    <div>
      <PageHeader
        title="Seguranca e LGPD"
        description="Diretrizes implementadas e pontos de governança para o tratamento de dados sensíveis previdenciários e de saúde."
      />

      <div className="card p-6">
        <ul className="space-y-3 text-sm text-stone-700">
          {measures.map((item) => (
            <li key={item} className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
