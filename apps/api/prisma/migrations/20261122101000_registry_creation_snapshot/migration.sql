ALTER TABLE "tontine_group" ADD COLUMN "creation_name" TEXT;
UPDATE "tontine_group" SET "creation_name" = "name";
ALTER TABLE "tontine_group" ALTER COLUMN "creation_name" SET NOT NULL;
