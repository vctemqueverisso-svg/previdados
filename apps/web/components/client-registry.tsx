"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CreateClientForm } from "./create-client-form";
import { Client } from "../lib/types";
import { getClientApiBaseUrl } from "../lib/client-api";

function getTokenFromCookie() {
  const value = document.cookie
    .split("; ")
    .find((item) => item.startsWith("token="))
    ?.split("=")[1];
  return value ?? "";
}

function sortClients(clients: Client[]) {
  return [...clients].sort((a, b) => a.fullName.localeCompare(b.fullName, "pt-BR"));
}

function formatClientAddress(client: Client) {
  const streetLine = [client.street, client.addressNumber].filter(Boolean).join(", ");
  const locationLine = [client.neighborhood, client.city, client.state].filter(Boolean).join(" - ");
  const complementLine = [client.complement, client.zipCode ? `CEP ${client.zipCode}` : ""].filter(Boolean).join(" | ");

  return [streetLine, locationLine, complementLine].filter(Boolean).join(" / ");
}

type ClientRegistryProps = {
  initialClients: Client[];
};

export function ClientRegistry({ initialClients }: ClientRegistryProps) {
  const [clients, setClients] = useState(() => sortClients(initialClients));
  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [busyClientId, setBusyClientId] = useState<string | null>(null);

  const editingClient = useMemo(
    () => clients.find((client) => client.id === editingClientId) ?? null,
    [clients, editingClientId]
  );

  async function handleDelete(client: Client) {
    if ((client.cases?.length ?? 0) > 0) {
      setFeedback("Esse cliente possui casos vinculados. Remova ou reatribua os casos antes de excluir.");
      return;
    }

    if (!window.confirm(`Deseja realmente excluir o cadastro de ${client.fullName}?`)) {
      return;
    }

    setBusyClientId(client.id);
    setFeedback("");

    const response = await fetch(`${getClientApiBaseUrl()}/api/clients/${client.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getTokenFromCookie()}`
      }
    });

    setBusyClientId(null);

    if (!response.ok) {
      setFeedback("Não foi possível excluir o cliente.");
      return;
    }

    setClients((current) => current.filter((item) => item.id !== client.id));
    if (editingClientId === client.id) {
      setEditingClientId(null);
    }
    setFeedback("Cliente removido com sucesso.");
  }

  return (
    <div className="space-y-6">
      {editingClient ? (
        <div className="space-y-3">
          <div>
            <p className="eyebrow">Edição</p>
            <h3 className="mt-2 text-2xl font-semibold text-ink">Atualizar cliente</h3>
            <p className="mt-2 text-sm text-[color:var(--text-soft)]">
              Revise os dados cadastrais e mantenha o histórico do cliente sempre completo.
            </p>
          </div>
          <CreateClientForm
            mode="edit"
            clientId={editingClient.id}
            initialValues={editingClient}
            onCancel={() => {
              setEditingClientId(null);
              setFeedback("");
            }}
            onSaved={(savedClient) => {
              setClients((current) => sortClients(current.map((item) => (item.id === savedClient.id ? { ...item, ...savedClient } : item))));
              setEditingClientId(null);
              setFeedback("Cliente atualizado com sucesso.");
            }}
          />
        </div>
      ) : (
        <CreateClientForm
          onSaved={(savedClient) => {
            setClients((current) => sortClients([...current, savedClient]));
            setFeedback("Cliente cadastrado com sucesso.");
          }}
        />
      )}

      <div className="card mt-6 overflow-x-auto">
        <table className="data-table min-w-full">
          <thead className="bg-[#f7f1e7]">
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>Contato</th>
              <th>Endereço</th>
              <th>Casos</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id}>
                <td className="font-medium">
                  <Link href={`/clientes/${client.id}`} className="text-ink hover:text-gold">
                    {client.fullName}
                  </Link>
                </td>
                <td>{client.cpf}</td>
                <td>{client.phone || client.email || "-"}</td>
                <td>{formatClientAddress(client) || "-"}</td>
                <td>{client.cases?.length ?? 0}</td>
                <td>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="rounded-xl border border-[rgba(24,38,63,0.12)] bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-ink hover:bg-slate-50"
                      onClick={() => {
                        setEditingClientId(client.id);
                        setFeedback("");
                      }}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="rounded-xl border border-[rgba(140,45,45,0.14)] bg-[rgba(255,242,242,0.95)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[color:#8b3a3a] hover:bg-[rgba(255,235,235,1)] disabled:cursor-not-allowed disabled:opacity-60"
                      onClick={() => handleDelete(client)}
                      disabled={busyClientId === client.id}
                    >
                      {busyClientId === client.id ? "Excluindo..." : "Excluir"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {feedback ? <p className="text-sm text-[color:var(--text-soft)]">{feedback}</p> : null}
    </div>
  );
}
