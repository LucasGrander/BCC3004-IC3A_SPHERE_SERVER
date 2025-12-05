ALTER TABLE "party_service" RENAME COLUMN "status" TO "contractStatus";--> statement-breakpoint
ALTER TABLE "party" ALTER COLUMN "party_type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."party_type";--> statement-breakpoint
CREATE TYPE "public"."party_type" AS ENUM('Pool Party', 'Eletrônica', 'Chá Revelação', 'Confraternização', 'Formatura', 'Casamento', 'Aniversário', 'Festa Infantil', 'Debutante', 'Jantar de Gala', 'Baile de Máscaras', 'Festival de Música', 'Karaokê', 'Festa Fantasia', 'Noite de Jogos', 'Churrasco', 'Luau', 'Festa Temática', 'Festa Junina', 'Réveillon', 'Natal', 'Halloween', 'Festa Sertaneja', 'Festa Rock', 'Festa Samba', 'Sunset', 'Evento Empresarial', 'Batizado', 'Festa Romântica', 'Festa Universitária');--> statement-breakpoint
ALTER TABLE "party" ALTER COLUMN "party_type" SET DATA TYPE "public"."party_type" USING "party_type"::"public"."party_type";--> statement-breakpoint
ALTER TABLE "person" ALTER COLUMN "role" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."person_role";--> statement-breakpoint
CREATE TYPE "public"."person_role" AS ENUM('fornecedor', 'organizador');--> statement-breakpoint
ALTER TABLE "person" ALTER COLUMN "role" SET DATA TYPE "public"."person_role" USING "role"::"public"."person_role";--> statement-breakpoint
ALTER TABLE "service" ALTER COLUMN "service_type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."service_type";--> statement-breakpoint
CREATE TYPE "public"."service_type" AS ENUM('Buffet', 'Bebidas', 'Barman', 'Confeitaria', 'Churrasqueiro', 'Decoração', 'Mobília', 'Iluminação', 'Sonorização', 'Infra', 'Brinquedos', 'Entretenimento', 'Recreação', 'Fotografia', 'Filmagem', 'Assessoria', 'Segurança', 'Limpeza', 'Staff', 'Garçons', 'Papelaria', 'Lembrancinhas', 'Beleza', 'Aluguel_de_Trajes', 'Transporte');--> statement-breakpoint
ALTER TABLE "service" ALTER COLUMN "service_type" SET DATA TYPE "public"."service_type" USING "service_type"::"public"."service_type";--> statement-breakpoint
ALTER TABLE "party" ADD COLUMN "isDeleted" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "party_service" ADD COLUMN "service_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "party_service" ADD COLUMN "service_price" text NOT NULL;--> statement-breakpoint
ALTER TABLE "service" ADD COLUMN "isDeleted" boolean DEFAULT false;