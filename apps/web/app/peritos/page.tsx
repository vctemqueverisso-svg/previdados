import Link from "next/link";
import { CreateExpertForm } from "../../components/create-expert-form";
import { PageHeader } from "../../components/page-header";
import { apiGet } from "../../lib/api";
import { Expert } from "../../lib/types";

export default async function ExpertsPage() {
  const experts = await apiGet<Expert[]>("/experts");

  return (
    <div>
      <PageHeader
        title="Peritos"
        description="Cadastro, acompanhamento de especialidade e leitura estatistica do comportamento pericial."
      />

      <CreateExpertForm />

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        {experts.map((expert) => (
          <article key={expert.id} className="card p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Link href={`/peritos/${expert.id}`} className="text-lg font-semibold text-ink hover:text-gold">
                  {expert.fullName}
                </Link>
                <p className="mt-1 text-sm text-stone-500">{expert.specialty || "Especialidade nao informada"}</p>
              </div>
              <span className="rounded-full bg-sand px-3 py-1 text-xs text-moss">
                {expert._count?.cases ?? 0} casos
              </span>
            </div>
            <div className="mt-4 text-sm text-stone-600">
              {[expert.city, expert.state].filter(Boolean).join("/") || "Local nao informado"}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
