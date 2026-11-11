ALTER TABLE "app_user" ADD COLUMN "wallet_account_id" TEXT;

INSERT INTO "ledger_account" ("id", "kind")
SELECT 'wallet:' || "id"::text, 'WALLET_USER' FROM "app_user";

INSERT INTO "ledger_account" ("id", "kind")
VALUES ('clearing:wallet-demo', 'CLEARING_SIMULATOR');

UPDATE "app_user" SET "wallet_account_id" = 'wallet:' || "id"::text;
ALTER TABLE "app_user" ALTER COLUMN "wallet_account_id" SET NOT NULL;
ALTER TABLE "app_user" ADD CONSTRAINT "app_user_wallet_account_id_key" UNIQUE ("wallet_account_id");
ALTER TABLE "app_user" ADD CONSTRAINT "app_user_wallet_account_id_fkey"
  FOREIGN KEY ("wallet_account_id") REFERENCES "ledger_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;
