ALTER TABLE "party" DROP CONSTRAINT "party_address_id_address_id_fk";
--> statement-breakpoint
ALTER TABLE "party" ADD COLUMN "address_street" text NOT NULL;--> statement-breakpoint
ALTER TABLE "party" ADD COLUMN "address_number" text NOT NULL;--> statement-breakpoint
ALTER TABLE "party" ADD COLUMN "address_complement" text;--> statement-breakpoint
ALTER TABLE "party" ADD COLUMN "address_neighborhood" text NOT NULL;--> statement-breakpoint
ALTER TABLE "party" ADD COLUMN "address_city" text NOT NULL;--> statement-breakpoint
ALTER TABLE "party" DROP COLUMN "address_id";