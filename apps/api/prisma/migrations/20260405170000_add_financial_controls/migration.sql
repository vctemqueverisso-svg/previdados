-- CreateTable
CREATE TABLE "FinancialControl" (
    "id" TEXT NOT NULL,
    "case_id" TEXT NOT NULL,
    "minimum_wage_amount" DECIMAL(12,2) NOT NULL DEFAULT 1621.00,
    "installment_percentage" DECIMAL(5,2) NOT NULL DEFAULT 30.00,
    "projected_benefit_months" INTEGER,
    "planned_installments" INTEGER NOT NULL DEFAULT 0,
    "paid_installments" INTEGER NOT NULL DEFAULT 0,
    "installment_value" DECIMAL(12,2) NOT NULL,
    "arrears_amount" DECIMAL(12,2),
    "arrears_percentage" DECIMAL(5,2) NOT NULL DEFAULT 30.00,
    "arrears_fee_value" DECIMAL(12,2),
    "arrears_fee_paid_amount" DECIMAL(12,2),
    "notes" TEXT,
    "created_by_user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinancialControl_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FinancialControl_case_id_key" ON "FinancialControl"("case_id");

-- CreateIndex
CREATE INDEX "FinancialControl_case_id_idx" ON "FinancialControl"("case_id");

-- AddForeignKey
ALTER TABLE "FinancialControl" ADD CONSTRAINT "FinancialControl_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancialControl" ADD CONSTRAINT "FinancialControl_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
