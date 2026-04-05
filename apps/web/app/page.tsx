import { DeadlineWorkspace } from "../components/deadline-workspace";
import { apiGet } from "../lib/api";
import { Client, DeadlineItem } from "../lib/types";

export default async function HomePage() {
  const [clients, deadlines] = await Promise.all([apiGet<Client[]>("/clients"), apiGet<DeadlineItem[]>("/deadlines")]);

  return (
    <DeadlineWorkspace
      clients={clients.map((client) => ({ id: client.id, label: client.fullName }))}
      initialDeadlines={deadlines}
    />
  );
}
