CREATE TYPE "DeadlineStatus" AS ENUM ('PENDENTE', 'CUMPRIDO', 'NAO_CUMPRIDO');

CREATE TABLE "Deadline" (
    "id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "responsible_name" TEXT NOT NULL,
    "status" "DeadlineStatus" NOT NULL DEFAULT 'PENDENTE',
    "notes" TEXT,
    "completed_at" TIMESTAMP(3),
    "created_by_user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Deadline_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Deadline_client_id_due_date_idx" ON "Deadline"("client_id", "due_date");
CREATE INDEX "Deadline_status_due_date_idx" ON "Deadline"("status", "due_date");

ALTER TABLE "Deadline" ADD CONSTRAINT "Deadline_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Deadline" ADD CONSTRAINT "Deadline_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
