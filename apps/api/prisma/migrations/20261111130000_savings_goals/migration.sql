CREATE TABLE "savings_goal" (
    "id" UUID PRIMARY KEY,
    "user_id" UUID NOT NULL REFERENCES "app_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    "name" TEXT NOT NULL,
    "installment_amount" BIGINT NOT NULL CHECK ("installment_amount" BETWEEN 1 AND 1000000000),
    "frequency" TEXT NOT NULL CHECK ("frequency" IN ('DAILY', 'WEEKLY', 'MONTHLY')),
    "installments_per_cycle" INTEGER NOT NULL CHECK ("installments_per_cycle" > 0),
    "cycle_count" INTEGER NOT NULL CHECK ("cycle_count" > 0),
    "starts_at" TIMESTAMPTZ(3) NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK ("installments_per_cycle"::BIGINT * "cycle_count" <= 366)
);

CREATE INDEX "savings_goal_user_id_created_at_id_idx" ON "savings_goal"("user_id", "created_at", "id");
