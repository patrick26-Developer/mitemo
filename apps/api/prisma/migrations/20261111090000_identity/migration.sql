CREATE TABLE "app_user" (
    "id" UUID PRIMARY KEY,
    "phone_number" TEXT NOT NULL UNIQUE,
    "display_name" TEXT NOT NULL,
    "pin_hash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER' CHECK ("role" IN ('USER', 'ADMIN')),
    "phone_verified_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "auth_challenge" (
    "id" UUID PRIMARY KEY,
    "user_id" UUID NOT NULL REFERENCES "app_user"("id") ON DELETE CASCADE,
    "otp_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMPTZ(3) NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "consumed_at" TIMESTAMPTZ(3)
);
CREATE INDEX "auth_challenge_user_id_idx" ON "auth_challenge"("user_id");

CREATE TABLE "auth_session" (
    "id" UUID PRIMARY KEY,
    "user_id" UUID NOT NULL REFERENCES "app_user"("id") ON DELETE CASCADE,
    "token_hash" TEXT NOT NULL UNIQUE,
    "device_label" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMPTZ(3) NOT NULL
);
CREATE INDEX "auth_session_user_id_idx" ON "auth_session"("user_id");
