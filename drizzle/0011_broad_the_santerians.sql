ALTER TABLE "service" ALTER COLUMN "service_type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."service_type";--> statement-breakpoint
CREATE TYPE "public"."service_type" AS ENUM('Buffet', 'Bebidas', 'Barman', 'Confeitaria', 'Churrasqueiro', 'Decoração', 'Mobília', 'Iluminação', 'Sonorização', 'Infra', 'Brinquedos', 'Entretenimento', 'Recreação', 'Fotografia', 'Filmagem', 'Assessoria', 'Segurança', 'Limpeza', 'Staff', 'Garçons', 'Entreterimento', 'Papelaria', 'Lembrancinhas', 'Beleza', 'Aluguel de Trajes', 'Transporte');--> statement-breakpoint
ALTER TABLE "service" ALTER COLUMN "service_type" SET DATA TYPE "public"."service_type" USING "service_type"::"public"."service_type";--> statement-breakpoint
ALTER TABLE "party_service" DROP CONSTRAINT "party_service_pkey";--> statement-breakpoint
ALTER TABLE "party_service" ALTER COLUMN "hasRead" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "party_service" ALTER COLUMN "contractStatus" SET DEFAULT 'Pendente';--> statement-breakpoint
ALTER TABLE "party_service" ADD COLUMN "id" serial PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "party_service" ADD COLUMN "total" text NOT NULL;--> statement-breakpoint
ALTER TABLE "party_service" ADD COLUMN "hasDeliveredNotification" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "party_service" DROP COLUMN "service_name";--> statement-breakpoint
ALTER TABLE "party_service" DROP COLUMN "service_price";