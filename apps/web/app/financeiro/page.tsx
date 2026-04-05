import { FinanceWorkspace } from "../../components/finance-workspace";
import { PageHeader } from "../../components/page-header";
import { apiGet } from "../../lib/api";
import { CaseItem, Client, FinancialControlItem } from "../../lib/types";

export default async function FinanceiroPage() {
  const [clients, cases, financialControls] = await Promise.all([
    apiGet<Client[]>("/clients"),
    apiGet<CaseItem[]>("/cases"),
    apiGet<FinancialControlItem[]>("/finance")
  ]);

  return (
    <div>
      <PageHeader
        title="Financeiro"
        description="Controle de honorarios por caso, com parcelas, atrasados e saldo em aberto em um so lugar."
      />

      <FinanceWorkspace clients={clients} cases={cases} initialControls={financialControls} />
    </div>
  );
}
