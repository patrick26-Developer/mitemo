CREATE TABLE "pawapay_sandbox_receipt" (
  "kind" TEXT NOT NULL,
  "id" UUID NOT NULL,
  "status" TEXT NOT NULL,
  "amount" BIGINT NOT NULL CHECK ("amount" > 0),
  "received_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "pawapay_sandbox_receipt_pkey" PRIMARY KEY ("kind", "id", "status", "amount")
);
