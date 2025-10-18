CREATE TYPE "public"."party_type" AS ENUM('PoolParty', 'Eletrônica', 'Aniversário', 'Chá Revelação', 'Confraternização', 'Formatura', 'Casamento');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('Pendente', 'Finalizado', 'Cancelado');--> statement-breakpoint
CREATE TYPE "public"."person_role" AS ENUM('Fornecedor', 'Organizador');--> statement-breakpoint
CREATE TYPE "public"."service_type" AS ENUM('Buffet', 'Bebidas', 'Mobília', 'Entreterimento', 'Iluminação', 'Infra', 'Fotografia');--> statement-breakpoint
CREATE TABLE "address" (
	"id" serial PRIMARY KEY NOT NULL,
	"street" text NOT NULL,
	"number" integer NOT NULL,
	"address_complement" text,
	"neighborhood" text NOT NULL,
	"city" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "party" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"date" date NOT NULL,
	"party_type" "party_type" NOT NULL,
	"person_id" integer NOT NULL,
	"address_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "party_service" (
	"service_id" integer NOT NULL,
	"party_id" integer NOT NULL,
	"amount" integer NOT NULL,
	"hascanceled" boolean,
	"hasread" boolean,
	"status" "status" NOT NULL,
	CONSTRAINT "party_service_pkey" PRIMARY KEY("service_id","party_id")
);
--> statement-breakpoint
CREATE TABLE "person" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"passord" text NOT NULL,
	"phone" text,
	"role" "person_role" NOT NULL,
	CONSTRAINT "person_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "service" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"service_type" "service_type" NOT NULL,
	"price" numeric NOT NULL,
	"person_id" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "party" ADD CONSTRAINT "party_person_id_person_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."person"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "party" ADD CONSTRAINT "party_address_id_address_id_fk" FOREIGN KEY ("address_id") REFERENCES "public"."address"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "party_service" ADD CONSTRAINT "party_service_service_id_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."service"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "party_service" ADD CONSTRAINT "party_service_party_id_party_id_fk" FOREIGN KEY ("party_id") REFERENCES "public"."party"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service" ADD CONSTRAINT "service_person_id_person_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."person"("id") ON DELETE cascade ON UPDATE no action;