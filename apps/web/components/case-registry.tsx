"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CaseItem } from "../lib/types";
import { CreateCaseForm } from "./create-case-form";

type Option = { id: string; label: string };

type Props = {
  initialCases: CaseItem[];
  clients: Option[];
  diseases: Option[];
  cids: Option[];
  experts: Option[];
  lockedClientId?: string;
};

function formatOutcome(item: CaseItem) {
  return item.result?.finalOutcome || item.currentStatus;
}

export function CaseRegistry({ initialCases, clients, diseases, cids, experts, lockedClientId }: Props) {
  const [selectedClientId, setSelectedClientId] = useState(lockedClientId ?? "");

  const visibleCases = useMemo(() => {
    if (!selectedClientId) {
      return [];
    }

    return initialCases.filter((item) => item.client.id === selectedClientId);
  }, [initialCases, selectedClientId]);

  return (
    <div className="space-y-6">
      <CreateCaseForm
        clients={clients}
        diseases={diseases}
        cids={cids}
        experts={experts}
        lockedClientId={lockedClientId}
        onClientChange={setSelectedClientId}
      />

      {selectedClientId ? (
        <div className="card mt-6 overflow-x-auto">
          <table className="data-table min-w-full">
            <thead className="bg-[#f7f1e7]">
              <tr>
                <th>Caso</th>
                <th>Cliente</th>
                <th>Via</th>
                <th>Benefício</th>
                <th>Doença/CID</th>
                <th>Perito</th>
                <th>Resultado</th>
              </tr>
            </thead>
            <tbody>
              {visibleCases.map((item) => (
                <tr key={item.id}>
                  <td>
                    <Link href={`/casos/${item.id}`} className="font-medium text-ink hover:text-gold">
                      {item.internalCode}
                    </Link>
                    <div className="text-xs text-stone-500">{item.caseNumber || "-"}</div>
                  </td>
                  <td>{item.client.fullName}</td>
                  <td>{item.channelType}</td>
                  <td>{item.benefitType}</td>
                  <td>{[item.mainDisease?.name, item.mainCid?.code].filter(Boolean).join(" / ") || "-"}</td>
                  <td>{item.expert?.fullName || "-"}</td>
                  <td>{formatOutcome(item)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card p-5">
          <p className="eyebrow">Histórico</p>
          <h3 className="mt-2 text-xl font-semibold text-ink">Selecione um cliente para visualizar os casos</h3>
          <p className="mt-2 text-sm text-[color:var(--text-soft)]">
            Os processos já cadastrados aparecem somente quando o caso estiver sendo aberto para um cliente específico.
          </p>
        </div>
      )}
    </div>
  );
}
