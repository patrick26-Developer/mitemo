-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "ledger_account" (
    "id" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "opened_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closed_at" TIMESTAMPTZ(3),

    CONSTRAINT "ledger_account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ledger_entry" (
    "id" TEXT NOT NULL,
    "idempotency_key" TEXT NOT NULL,
    "payload_hash" TEXT NOT NULL,
    "operation_ref" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "occurred_at" TIMESTAMPTZ(3) NOT NULL,
    "recorded_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recorded_by" TEXT NOT NULL,
    "settlement_mode" TEXT NOT NULL,
    "reverses_entry_id" TEXT,

    CONSTRAINT "ledger_entry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ledger_posting_line" (
    "entry_id" TEXT NOT NULL,
    "line_no" SMALLINT NOT NULL,
    "account_id" TEXT NOT NULL,
    "amount" BIGINT NOT NULL,

    CONSTRAINT "ledger_posting_line_pkey" PRIMARY KEY ("entry_id","line_no")
);

-- CreateIndex
CREATE UNIQUE INDEX "ledger_entry_idempotency_key_key" ON "ledger_entry"("idempotency_key");

-- CreateIndex
CREATE UNIQUE INDEX "ledger_entry_reverses_entry_id_key" ON "ledger_entry"("reverses_entry_id");

-- CreateIndex
CREATE INDEX "ledger_entry_operation_ref_idx" ON "ledger_entry"("operation_ref");

-- CreateIndex
CREATE INDEX "ledger_posting_line_account_id_idx" ON "ledger_posting_line"("account_id");

-- AddForeignKey
ALTER TABLE "ledger_entry" ADD CONSTRAINT "ledger_entry_reverses_entry_id_fkey" FOREIGN KEY ("reverses_entry_id") REFERENCES "ledger_entry"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ledger_posting_line" ADD CONSTRAINT "ledger_posting_line_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "ledger_entry"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ledger_posting_line" ADD CONSTRAINT "ledger_posting_line_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "ledger_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;


-- ===========================================================================
-- Garanties du grand livre que Prisma ne sait pas exprimer (issue #6).
-- Chaque garantie est vérifiée par les tests d'intégration du grand livre
-- (src/features/ledger/infrastructure/ledger-*.int-spec.ts).
-- Les messages commencent par un code stable (LEDGER_...) lu par l'adaptateur.
-- ===========================================================================

-- Contraintes de validation ------------------------------------------------

-- Natures de comptes : doit rester identique à LEDGER_ACCOUNT_KINDS (ledger-book.ts).
ALTER TABLE "ledger_account" ADD CONSTRAINT "ledger_account_kind_check" CHECK ("kind" IN (
  'WALLET_USER', 'POT_TONTINE', 'GUARANTEE_TONTINE', 'GUARANTEE_MEMBER',
  'CLEARING_MTN', 'CLEARING_AIRTEL', 'CLEARING_SIMULATOR',
  'SAVINGS_CARD_CAISSE', 'RISTOURNE_CAISSE',
  'PLATFORM_REVENUE', 'PLATFORM_FEES_PSP', 'SUSPENSE'
));
ALTER TABLE "ledger_account" ADD CONSTRAINT "ledger_account_id_check" CHECK (btrim("id") <> '');

ALTER TABLE "ledger_entry" ADD CONSTRAINT "ledger_entry_id_check" CHECK (btrim("id") <> '');
ALTER TABLE "ledger_entry" ADD CONSTRAINT "ledger_entry_idempotency_key_check" CHECK (btrim("idempotency_key") <> '');
ALTER TABLE "ledger_entry" ADD CONSTRAINT "ledger_entry_description_check" CHECK (btrim("description") <> '');
ALTER TABLE "ledger_entry" ADD CONSTRAINT "ledger_entry_operation_ref_check" CHECK (btrim("operation_ref") <> '');
ALTER TABLE "ledger_entry" ADD CONSTRAINT "ledger_entry_recorded_by_check" CHECK (btrim("recorded_by") <> '');
ALTER TABLE "ledger_entry" ADD CONSTRAINT "ledger_entry_not_self_reversal" CHECK ("reverses_entry_id" IS NULL OR "reverses_entry_id" <> "id");
-- ADR 0005 : aucun fonds réel sans validation juridique. Autoriser un autre mode
-- de règlement exigera une nouvelle migration revue, jamais un simple paramètre.
ALTER TABLE "ledger_entry" ADD CONSTRAINT "ledger_entry_settlement_mode_check" CHECK ("settlement_mode" = 'SIMULATED');

ALTER TABLE "ledger_posting_line" ADD CONSTRAINT "ledger_posting_line_amount_check" CHECK ("amount" <> 0);
ALTER TABLE "ledger_posting_line" ADD CONSTRAINT "ledger_posting_line_line_no_check" CHECK ("line_no" >= 1);

-- Immuabilité ---------------------------------------------------------------

CREATE FUNCTION "ledger_forbid_change"() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'LEDGER_IMMUTABLE: % interdit sur %, une correction passe par une contre-écriture',
    TG_OP, TG_TABLE_NAME;
END;
$$;

CREATE TRIGGER "ledger_entry_immutable" BEFORE UPDATE OR DELETE ON "ledger_entry"
  FOR EACH ROW EXECUTE FUNCTION "ledger_forbid_change"();
CREATE TRIGGER "ledger_entry_no_truncate" BEFORE TRUNCATE ON "ledger_entry"
  FOR EACH STATEMENT EXECUTE FUNCTION "ledger_forbid_change"();
CREATE TRIGGER "ledger_posting_line_immutable" BEFORE UPDATE OR DELETE ON "ledger_posting_line"
  FOR EACH ROW EXECUTE FUNCTION "ledger_forbid_change"();
CREATE TRIGGER "ledger_posting_line_no_truncate" BEFORE TRUNCATE ON "ledger_posting_line"
  FOR EACH STATEMENT EXECUTE FUNCTION "ledger_forbid_change"();
CREATE TRIGGER "ledger_account_no_delete" BEFORE DELETE ON "ledger_account"
  FOR EACH ROW EXECUTE FUNCTION "ledger_forbid_change"();
CREATE TRIGGER "ledger_account_no_truncate" BEFORE TRUNCATE ON "ledger_account"
  FOR EACH STATEMENT EXECUTE FUNCTION "ledger_forbid_change"();

-- Un compte ne change jamais d'identité ni de nature ; seule la clôture est permise, une fois.
CREATE FUNCTION "ledger_account_guard_update"() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW."id" <> OLD."id" OR NEW."kind" <> OLD."kind" OR NEW."opened_at" <> OLD."opened_at"
     OR OLD."closed_at" IS NOT NULL OR NEW."closed_at" IS NULL THEN
    RAISE EXCEPTION 'LEDGER_IMMUTABLE: seule la clôture d''un compte ouvert est permise (%)', OLD."id";
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER "ledger_account_guard_update" BEFORE UPDATE ON "ledger_account"
  FOR EACH ROW EXECUTE FUNCTION "ledger_account_guard_update"();

-- Aucune imputation sur un compte clôturé ------------------------------------

CREATE FUNCTION "ledger_refuse_closed_account"() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM "ledger_account" WHERE "id" = NEW."account_id" AND "closed_at" IS NOT NULL) THEN
    RAISE EXCEPTION 'LEDGER_ACCOUNT_CLOSED: compte clôturé %', NEW."account_id";
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER "ledger_posting_line_open_account" BEFORE INSERT ON "ledger_posting_line"
  FOR EACH ROW EXECUTE FUNCTION "ledger_refuse_closed_account"();

-- Équilibre vérifié en fin de transaction --------------------------------------
-- Différé : une écriture s'insère ligne par ligne ; vérifier après chaque ligne
-- rejetterait une écriture équilibrée encore incomplète.

CREATE FUNCTION "ledger_check_entry_balanced"() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  target TEXT;
  line_count INTEGER;
  total NUMERIC;
BEGIN
  -- Deux affectations distinctes : PL/pgSQL résout tous les champs de NEW cités,
  -- même dans la branche non retenue d'un CASE.
  IF TG_TABLE_NAME = 'ledger_entry' THEN
    target := NEW."id";
  ELSE
    target := NEW."entry_id";
  END IF;
  SELECT count(*), COALESCE(sum("amount"), 0) INTO line_count, total
    FROM "ledger_posting_line" WHERE "entry_id" = target;
  IF line_count < 2 THEN
    RAISE EXCEPTION 'LEDGER_UNBALANCED: l''écriture % compte % imputation(s), au moins 2 exigées', target, line_count;
  END IF;
  IF total <> 0 THEN
    RAISE EXCEPTION 'LEDGER_UNBALANCED: la somme des imputations de % vaut %', target, total;
  END IF;
  RETURN NULL;
END;
$$;

CREATE CONSTRAINT TRIGGER "ledger_entry_balanced" AFTER INSERT ON "ledger_entry"
  DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION "ledger_check_entry_balanced"();
CREATE CONSTRAINT TRIGGER "ledger_posting_line_balanced" AFTER INSERT ON "ledger_posting_line"
  DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION "ledger_check_entry_balanced"();

-- Contre-écritures exactes -----------------------------------------------------
-- Une contre-écriture annule chaque ligne de l'originale : mêmes comptes,
-- montants opposés, même multiplicité. L'ordre des lignes n'est pas comptable.
-- Différé : les lignes des deux écritures peuvent être insérées dans n'importe
-- quel ordre au sein d'une même transaction.

CREATE FUNCTION "ledger_check_reversal_exact"() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  reversal_id TEXT;
  original_id TEXT;
  mismatch BIGINT;
BEGIN
  IF TG_TABLE_NAME = 'ledger_entry' THEN
    reversal_id := NEW."id";
    original_id := NEW."reverses_entry_id";
  ELSE
    reversal_id := NEW."entry_id";
    SELECT "reverses_entry_id" INTO original_id
      FROM "ledger_entry" WHERE "id" = reversal_id;
    -- Ligne ajoutée à l'écriture d'origine : retrouver sa contre-écriture.
    IF original_id IS NULL THEN
      original_id := reversal_id;
      SELECT "id" INTO reversal_id
        FROM "ledger_entry" WHERE "reverses_entry_id" = original_id;
    END IF;
  END IF;
  IF reversal_id IS NULL OR original_id IS NULL THEN
    RETURN NULL;
  END IF;
  SELECT count(*) INTO mismatch FROM (
    (SELECT "account_id", "amount" FROM "ledger_posting_line" WHERE "entry_id" = reversal_id
     EXCEPT ALL
     SELECT "account_id", -"amount" FROM "ledger_posting_line" WHERE "entry_id" = original_id)
    UNION ALL
    (SELECT "account_id", -"amount" FROM "ledger_posting_line" WHERE "entry_id" = original_id
     EXCEPT ALL
     SELECT "account_id", "amount" FROM "ledger_posting_line" WHERE "entry_id" = reversal_id)
  ) AS differences;
  IF mismatch <> 0 THEN
    RAISE EXCEPTION 'LEDGER_REVERSAL_MISMATCH: la contre-écriture % n''annule pas exactement %',
      reversal_id, original_id;
  END IF;
  RETURN NULL;
END;
$$;

CREATE CONSTRAINT TRIGGER "ledger_entry_reversal_exact" AFTER INSERT ON "ledger_entry"
  DEFERRABLE INITIALLY DEFERRED FOR EACH ROW
  WHEN (NEW."reverses_entry_id" IS NOT NULL)
  EXECUTE FUNCTION "ledger_check_reversal_exact"();
CREATE CONSTRAINT TRIGGER "ledger_posting_line_reversal_exact" AFTER INSERT ON "ledger_posting_line"
  DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION "ledger_check_reversal_exact"();

-- Soldes non négatifs vérifiés en fin de transaction -----------------------------
-- Doit rester identique à NON_NEGATIVE_KINDS (ledger-book.ts). En SERIALIZABLE, la
-- lecture de ce déclencheur participe à la détection des conflits : deux débits
-- concurrents ne peuvent pas rendre un solde négatif.

CREATE FUNCTION "ledger_check_non_negative"() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  account_kind TEXT;
  balance NUMERIC;
BEGIN
  SELECT "kind" INTO account_kind FROM "ledger_account" WHERE "id" = NEW."account_id";
  IF account_kind IN ('WALLET_USER', 'SAVINGS_CARD_CAISSE', 'RISTOURNE_CAISSE') THEN
    SELECT COALESCE(sum("amount"), 0) INTO balance
      FROM "ledger_posting_line" WHERE "account_id" = NEW."account_id";
    IF balance < 0 THEN
      RAISE EXCEPTION 'LEDGER_NEGATIVE_BALANCE: le solde de % deviendrait %', NEW."account_id", balance;
    END IF;
  END IF;
  RETURN NULL;
END;
$$;

CREATE CONSTRAINT TRIGGER "ledger_posting_line_non_negative" AFTER INSERT ON "ledger_posting_line"
  DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION "ledger_check_non_negative"();
