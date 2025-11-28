ALTER TABLE "party" ALTER COLUMN "party_type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."party_type";--> statement-breakpoint
CREATE TYPE "public"."party_type" AS ENUM('pool_party', 'eletronica', 'aniversario', 'cha_revelacao', 'confraternizacao', 'formatura', 'casamento');--> statement-breakpoint
ALTER TABLE "party" ALTER COLUMN "party_type" SET DATA TYPE "public"."party_type" USING "party_type"::"public"."party_type";--> statement-breakpoint
ALTER TABLE "party" ALTER COLUMN "date" SET DATA TYPE timestamp;