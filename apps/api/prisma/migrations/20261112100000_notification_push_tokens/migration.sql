CREATE TABLE "notification_push_token" (
  "user_id" UUID NOT NULL REFERENCES "app_user"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "token" TEXT NOT NULL,
  "platform" TEXT NOT NULL CHECK ("platform" IN ('IOS', 'ANDROID')),
  "app_version" TEXT NOT NULL,
  "registered_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("user_id", "token")
);
