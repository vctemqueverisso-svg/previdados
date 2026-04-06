"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { getClientApiBaseUrl } from "../lib/client-api";
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

function getTokenFromCookie() {
  return (
    document.cookie
      .split("; ")
      .find((item) => item.startsWith("token="))
      ?.split("=")[1] ?? ""
  );
}

export function CaseRegistry({ initialCases, clients, diseases, cids, experts, lockedClientId }: Props) {
  const [cases, setCases] = useState(initialCases);
  const [selectedClientId, setSelectedClientId] = useState(lockedClientId ?? "");

  const visibleCases = useMemo(() => {
    if (!selectedClientId) {
      return [];
    }

    return cases.filter((item) => item.client.id === selectedClientId);
  }, [cases, selectedClientId]);

  async function removeCase(id: string) {
    const confirmed = window.confirm("Deseja mesmo excluir este caso?");
    if (!confirmed) {
      return;
    }

    const response = await fetch(`${getClientApiBaseUrl()}/api/cases/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getTokenFromCookie()}`
      }
    });

    if (!response.ok) {
      window.alert("Não foi possível excluir o caso.");
      return;
    }

    setCases((current) => current.filter((item) => item.id !== id));
  }

  return (
    <div className="space-y-6">
      <CreateCaseForm
        clients={clients}
        diseases={diseases}
        cids={cids}
        experts={experts}
        lockedClientId={lockedClientId}
        onClientChange={setSelectedClientId}
        onSaved={(savedCase) => {
          const normalizedCase: CaseItem = {
            ...savedCase,
            mainDisease: savedCase.mainDisease ?? undefined,
            mainCid: savedCase.mainCid ?? undefined,
            expert: savedCase.expert ?? undefined,
            result: savedCase.result ?? undefined
          };

          setCases((current) => [normalizedCase, ...current]);
          setSelectedClientId(savedCase.client.id);
        }}
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
                <th>Ações</th>
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
                  <td>
                    <div className="flex gap-2">
                      <Link
                        href={`/casos/${item.id}`}
                        className="rounded-xl border border-[rgba(24,38,63,0.12)] bg-white px-3 py-2 text-xs font-medium text-ink hover:bg-slate-50"
                      >
                        Ver
                      </Link>
                      <button
                        type="button"
                        className="rounded-xl border border-[rgba(140,45,45,0.14)] bg-white px-3 py-2 text-xs font-medium text-[#8b3a3a] hover:bg-[rgba(255,242,242,1)]"
                        onClick={() => removeCase(item.id)}
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
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
