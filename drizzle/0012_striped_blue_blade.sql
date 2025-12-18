CREATE TABLE "notification" (
	"id" serial PRIMARY KEY NOT NULL,
	"person_id" integer NOT NULL,
	"contract_id" integer NOT NULL,
	"hasRead" boolean DEFAULT false,
	"hasDelivered" boolean DEFAULT false,
	"canceledIn" date NOT NULL
);
--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_person_id_person_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."person"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_contract_id_party_service_id_fk" FOREIGN KEY ("contract_id") REFERENCES "public"."party_service"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "party_service" DROP COLUMN "hasRead";--> statement-breakpoint
ALTER TABLE "party_service" DROP COLUMN "hasDeliveredNotification";