CREATE TYPE "AttendanceKind" AS ENUM (
  'CONSULTA_INICIAL',
  'RETORNO',
  'TRIAGEM_DOCUMENTAL',
  'ESTRATEGIA_PROCESSUAL',
  'POS_DECISAO'
);

CREATE TABLE "Attendance" (
  "id" TEXT NOT NULL,
  "client_id" TEXT NOT NULL,
  "case_id" TEXT,
  "kind" "AttendanceKind" NOT NULL DEFAULT 'CONSULTA_INICIAL',
  "title" TEXT NOT NULL,
  "attendance_date" TIMESTAMP(3) NOT NULL,
  "contact_channel" TEXT,
  "summary" TEXT,
  "client_report" TEXT,
  "legal_strategy" TEXT,
  "requested_documents" TEXT,
  "next_steps" TEXT,
  "created_by_user_id" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Attendance_client_id_attendance_date_idx" ON "Attendance"("client_id", "attendance_date");
CREATE INDEX "Attendance_case_id_attendance_date_idx" ON "Attendance"("case_id", "attendance_date");

ALTER TABLE "Attendance"
  ADD CONSTRAINT "Attendance_client_id_fkey"
  FOREIGN KEY ("client_id") REFERENCES "Client"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Attendance"
  ADD CONSTRAINT "Attendance_case_id_fkey"
  FOREIGN KEY ("case_id") REFERENCES "Case"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Attendance"
  ADD CONSTRAINT "Attendance_created_by_user_id_fkey"
  FOREIGN KEY ("created_by_user_id") REFERENCES "User"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;
