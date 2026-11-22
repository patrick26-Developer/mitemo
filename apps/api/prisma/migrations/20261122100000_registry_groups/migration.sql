-- CreateTable
CREATE TABLE "tontine_group" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "owner_id" UUID NOT NULL,
    "contribution_amount" BIGINT NOT NULL,
    "participant_count" INTEGER NOT NULL,
    "frequency_unit" TEXT NOT NULL,
    "frequency_interval" INTEGER NOT NULL,
    "state" TEXT NOT NULL DEFAULT 'RECRUTEMENT',
    "mode" TEXT NOT NULL DEFAULT 'REGISTRY',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tontine_group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tontine_member" (
    "group_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "role" TEXT NOT NULL,
    "state" TEXT NOT NULL DEFAULT 'ACTIF',
    "policy_version" TEXT NOT NULL,
    "joined_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tontine_member_pkey" PRIMARY KEY ("group_id","user_id")
);

-- CreateTable
CREATE TABLE "tontine_invitation" (
    "id" UUID NOT NULL,
    "group_id" UUID NOT NULL,
    "recipient_id" UUID NOT NULL,
    "issued_by" UUID NOT NULL,
    "state" TEXT NOT NULL DEFAULT 'PENDING',
    "expires_at" TIMESTAMPTZ(3) NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tontine_invitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group_fee_policy" (
    "group_id" UUID NOT NULL,
    "version" TEXT NOT NULL,
    "mode" TEXT NOT NULL DEFAULT 'FREE',
    "responsible_bps" INTEGER NOT NULL DEFAULT 0,
    "mitemo_bps" INTEGER NOT NULL DEFAULT 0,
    "operator_fixed" BIGINT NOT NULL DEFAULT 0,
    "effective_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "group_fee_policy_pkey" PRIMARY KEY ("group_id","version")
);

-- CreateTable
CREATE TABLE "audit_event" (
    "id" UUID NOT NULL,
    "group_id" UUID NOT NULL,
    "actor_id" UUID NOT NULL,
    "action" TEXT NOT NULL,
    "subject_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tontine_group_owner_id_idx" ON "tontine_group"("owner_id");

-- CreateIndex
CREATE INDEX "tontine_member_user_id_idx" ON "tontine_member"("user_id");

-- CreateIndex
CREATE INDEX "tontine_invitation_issued_by_idx" ON "tontine_invitation"("issued_by");

-- CreateIndex
CREATE INDEX "tontine_invitation_recipient_id_state_idx" ON "tontine_invitation"("recipient_id", "state");

-- CreateIndex
CREATE UNIQUE INDEX "tontine_invitation_group_id_recipient_id_key" ON "tontine_invitation"("group_id", "recipient_id");

-- CreateIndex
CREATE INDEX "audit_event_group_id_created_at_idx" ON "audit_event"("group_id", "created_at");

-- CreateIndex
CREATE INDEX "audit_event_actor_id_idx" ON "audit_event"("actor_id");

-- AddForeignKey
ALTER TABLE "tontine_group" ADD CONSTRAINT "tontine_group_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "app_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tontine_member" ADD CONSTRAINT "tontine_member_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tontine_member" ADD CONSTRAINT "tontine_member_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "tontine_group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tontine_invitation" ADD CONSTRAINT "tontine_invitation_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "app_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tontine_invitation" ADD CONSTRAINT "tontine_invitation_issued_by_fkey" FOREIGN KEY ("issued_by") REFERENCES "app_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tontine_invitation" ADD CONSTRAINT "tontine_invitation_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "tontine_group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_fee_policy" ADD CONSTRAINT "group_fee_policy_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "tontine_group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_event" ADD CONSTRAINT "audit_event_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "tontine_group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_event" ADD CONSTRAINT "audit_event_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "app_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "tontine_group" ADD CONSTRAINT "registry_group_terms" CHECK (
  length(trim(name)) BETWEEN 1 AND 80 AND contribution_amount > 0
  AND participant_count BETWEEN 2 AND 100
  AND frequency_unit IN ('jour','semaine','mois') AND frequency_interval BETWEEN 1 AND 365
  AND mode = 'REGISTRY' AND state = 'RECRUTEMENT'
);
ALTER TABLE "tontine_member" ADD CONSTRAINT "registry_member_role" CHECK (
  role IN ('ADMIN','MEMBRE') AND state = 'ACTIF'
);
ALTER TABLE "tontine_invitation" ADD CONSTRAINT "registry_invitation_state" CHECK (
  state IN ('PENDING','ACCEPTED','DECLINED') AND expires_at > created_at
);
ALTER TABLE "group_fee_policy" ADD CONSTRAINT "registry_free_policy" CHECK (
  mode = 'FREE' AND responsible_bps = 0 AND mitemo_bps = 0 AND operator_fixed = 0
);
ALTER TABLE "tontine_member" ADD CONSTRAINT "registry_accepted_policy"
  FOREIGN KEY ("group_id","policy_version") REFERENCES "group_fee_policy"("group_id","version") ON DELETE RESTRICT;
CREATE FUNCTION registry_immutable() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN RAISE EXCEPTION 'REGISTRY_IMMUTABLE'; END;
$$;
CREATE TRIGGER registry_policy_immutable BEFORE UPDATE OR DELETE ON "group_fee_policy"
  FOR EACH ROW EXECUTE FUNCTION registry_immutable();
CREATE TRIGGER registry_audit_immutable BEFORE UPDATE OR DELETE ON "audit_event"
  FOR EACH ROW EXECUTE FUNCTION registry_immutable();
