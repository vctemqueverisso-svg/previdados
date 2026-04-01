-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'ADVOGADO', 'ASSISTENTE', 'LEITURA');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('FEMININO', 'MASCULINO', 'OUTRO', 'NAO_INFORMADO');

-- CreateEnum
CREATE TYPE "ChannelType" AS ENUM ('ADMINISTRATIVO', 'JUDICIAL');

-- CreateEnum
CREATE TYPE "BenefitType" AS ENUM ('AUXILIO_DOENCA', 'APOSENTADORIA_INCAPACIDADE', 'BPC_LOAS', 'OUTRO');

-- CreateEnum
CREATE TYPE "CaseStatus" AS ENUM ('EM_ANALISE', 'AGUARDANDO_DOCUMENTOS', 'EM_PERICIA', 'AGUARDANDO_DECISAO', 'CONCLUIDO', 'ARQUIVADO');

-- CreateEnum
CREATE TYPE "StrengthLevel" AS ENUM ('FRACA', 'MEDIA', 'FORTE');

-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('BAIXO', 'MEDIO', 'ALTO');

-- CreateEnum
CREATE TYPE "ProceduralEventType" AS ENUM ('PROTOCOLO', 'PERICIA_ADMINISTRATIVA', 'DECISAO_ADMINISTRATIVA', 'AJUIZAMENTO', 'PERICIA_JUDICIAL', 'SENTENCA', 'RECURSO', 'ACORDAO', 'CUMPRIMENTO', 'OUTRO');

-- CreateEnum
CREATE TYPE "OutcomeStatus" AS ENUM ('DEFERIDO', 'INDEFERIDO', 'PROCEDENTE', 'IMPROCEDENTE', 'PARCIALMENTE_PROCEDENTE', 'ACORDO', 'PENDENTE');

-- CreateEnum
CREATE TYPE "OCRStatus" AS ENUM ('PENDENTE', 'PROCESSANDO', 'CONCLUIDO', 'FALHOU');

-- CreateEnum
CREATE TYPE "AIStatus" AS ENUM ('NAO_INICIADO', 'PENDENTE_REVISAO', 'APROVADO', 'REJEITADO');

-- CreateEnum
CREATE TYPE "ExtractionSourceType" AS ENUM ('MANUAL', 'AI', 'OCR_E_AI');

-- CreateEnum
CREATE TYPE "IncapacityScope" AS ENUM ('TOTAL', 'PARCIAL', 'NAO_INFORMADO');

-- CreateEnum
CREATE TYPE "IncapacityDuration" AS ENUM ('TEMPORARIA', 'PERMANENTE', 'NAO_INFORMADO');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'ADVOGADO',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_login_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "birth_date" TIMESTAMP(3) NOT NULL,
    "gender" "Gender" NOT NULL DEFAULT 'NAO_INFORMADO',
    "phone" TEXT,
    "email" TEXT,
    "city" TEXT,
    "state" TEXT,
    "notes" TEXT,
    "created_by_user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Disease" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "normalized_name" TEXT NOT NULL,

    CONSTRAINT "Disease_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cid" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "chapter" TEXT,

    CONSTRAINT "Cid_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expert" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "specialty" TEXT,
    "registry_number" TEXT,
    "city" TEXT,
    "state" TEXT,
    "internal_notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Expert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Case" (
    "id" TEXT NOT NULL,
    "internal_code" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "case_number" TEXT,
    "channel_type" "ChannelType" NOT NULL,
    "benefit_type" "BenefitType" NOT NULL,
    "protocol_date" TIMESTAMP(3),
    "der_date" TIMESTAMP(3),
    "expert_exam_date" TIMESTAMP(3),
    "decision_date" TIMESTAMP(3),
    "main_disease_id" TEXT,
    "main_cid_id" TEXT,
    "profession" TEXT,
    "education_level" TEXT,
    "age_at_filing" INTEGER,
    "family_income" DECIMAL(12,2),
    "family_group_description" TEXT,
    "expert_id" TEXT,
    "court_agency_name" TEXT,
    "court_division" TEXT,
    "city" TEXT,
    "state" TEXT,
    "urgent_relief_requested" BOOLEAN NOT NULL DEFAULT false,
    "current_status" "CaseStatus" NOT NULL DEFAULT 'EM_ANALISE',
    "strategy_summary" TEXT,
    "created_by_user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Case_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaseSecondaryDisease" (
    "id" TEXT NOT NULL,
    "case_id" TEXT NOT NULL,
    "disease_id" TEXT NOT NULL,

    CONSTRAINT "CaseSecondaryDisease_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaseSecondaryCid" (
    "id" TEXT NOT NULL,
    "case_id" TEXT NOT NULL,
    "cid_id" TEXT NOT NULL,

    CONSTRAINT "CaseSecondaryCid_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "is_medical" BOOLEAN NOT NULL DEFAULT false,
    "is_procedural" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "client_id" TEXT,
    "case_id" TEXT,
    "category_id" TEXT NOT NULL,
    "uploaded_by_user_id" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "original_file_name" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "storage_key" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "document_date" TIMESTAMP(3),
    "origin" TEXT,
    "notes" TEXT,
    "ocr_status" "OCRStatus" NOT NULL DEFAULT 'PENDENTE',
    "ai_status" "AIStatus" NOT NULL DEFAULT 'NAO_INICIADO',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentExtraction" (
    "id" TEXT NOT NULL,
    "document_id" TEXT NOT NULL,
    "source_type" "ExtractionSourceType" NOT NULL,
    "disease_id" TEXT,
    "cid_id" TEXT,
    "medical_conclusion" TEXT,
    "has_incapacity" BOOLEAN,
    "incapacity_scope" "IncapacityScope",
    "incapacity_duration" "IncapacityDuration",
    "disability_start_date" TIMESTAMP(3),
    "functional_limitations" TEXT,
    "analyzed_profession" TEXT,
    "rehabilitation_possible" BOOLEAN,
    "decision_grounding" TEXT,
    "final_conclusion" TEXT,
    "confidence_score" DOUBLE PRECISION,
    "reviewed_by_user_id" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentExtraction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaseResult" (
    "id" TEXT NOT NULL,
    "case_id" TEXT NOT NULL,
    "administrative_result" "OutcomeStatus",
    "judicial_result" "OutcomeStatus",
    "final_outcome" "OutcomeStatus",
    "outcome_reason" TEXT,
    "decision_summary" TEXT,
    "success_flag" BOOLEAN,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CaseResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProceduralEvent" (
    "id" TEXT NOT NULL,
    "case_id" TEXT NOT NULL,
    "event_type" "ProceduralEventType" NOT NULL,
    "event_date" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "related_document_id" TEXT,
    "created_by_user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProceduralEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InternalNote" (
    "id" TEXT NOT NULL,
    "case_id" TEXT NOT NULL,
    "strength_of_medical_evidence" "StrengthLevel",
    "main_obstacle" TEXT,
    "main_thesis" TEXT,
    "secondary_thesis" TEXT,
    "hearing_exam_notes" TEXT,
    "estimated_risk" "RiskLevel",
    "reason_for_denial" TEXT,
    "decision_central_ground" TEXT,
    "private_note" TEXT,
    "created_by_user_id" TEXT NOT NULL,
    "updated_by_user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InternalNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "metadata_json" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Client_cpf_key" ON "Client"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Disease_name_key" ON "Disease"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Cid_code_key" ON "Cid"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Case_internal_code_key" ON "Case"("internal_code");

-- CreateIndex
CREATE UNIQUE INDEX "CaseSecondaryDisease_case_id_disease_id_key" ON "CaseSecondaryDisease"("case_id", "disease_id");

-- CreateIndex
CREATE UNIQUE INDEX "CaseSecondaryCid_case_id_cid_id_key" ON "CaseSecondaryCid"("case_id", "cid_id");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentCategory_code_key" ON "DocumentCategory"("code");

-- CreateIndex
CREATE UNIQUE INDEX "CaseResult_case_id_key" ON "CaseResult"("case_id");

-- CreateIndex
CREATE INDEX "ProceduralEvent_case_id_event_date_idx" ON "ProceduralEvent"("case_id", "event_date");

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_main_disease_id_fkey" FOREIGN KEY ("main_disease_id") REFERENCES "Disease"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_main_cid_id_fkey" FOREIGN KEY ("main_cid_id") REFERENCES "Cid"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_expert_id_fkey" FOREIGN KEY ("expert_id") REFERENCES "Expert"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseSecondaryDisease" ADD CONSTRAINT "CaseSecondaryDisease_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseSecondaryDisease" ADD CONSTRAINT "CaseSecondaryDisease_disease_id_fkey" FOREIGN KEY ("disease_id") REFERENCES "Disease"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseSecondaryCid" ADD CONSTRAINT "CaseSecondaryCid_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseSecondaryCid" ADD CONSTRAINT "CaseSecondaryCid_cid_id_fkey" FOREIGN KEY ("cid_id") REFERENCES "Cid"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "Case"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "DocumentCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_uploaded_by_user_id_fkey" FOREIGN KEY ("uploaded_by_user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentExtraction" ADD CONSTRAINT "DocumentExtraction_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentExtraction" ADD CONSTRAINT "DocumentExtraction_disease_id_fkey" FOREIGN KEY ("disease_id") REFERENCES "Disease"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentExtraction" ADD CONSTRAINT "DocumentExtraction_cid_id_fkey" FOREIGN KEY ("cid_id") REFERENCES "Cid"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseResult" ADD CONSTRAINT "CaseResult_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProceduralEvent" ADD CONSTRAINT "ProceduralEvent_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProceduralEvent" ADD CONSTRAINT "ProceduralEvent_related_document_id_fkey" FOREIGN KEY ("related_document_id") REFERENCES "Document"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InternalNote" ADD CONSTRAINT "InternalNote_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
