import { boolean, integer, pgEnum, pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import { service } from "./service";
import { party } from "./party";
import { relations } from "drizzle-orm";

export const contractStatus = ['Pendente', 'Finalizado', 'Cancelado'] as const 

export const status = pgEnum('status', contractStatus);

export const partyService = pgTable("party_service", {
	serviceId: integer("service_id").references(() => service.id, {onDelete: 'restrict'}).notNull(),
	partyId: integer("party_id").references(() => party.id, {onDelete: 'restrict'}).notNull(),
	serviceName: text('service_name').notNull(),
	servicePrice: text('service_price').notNull(),
	amount: integer().notNull(),
	hasRead: boolean(),
	status: status('contractStatus').notNull(),
}, (table) => [
	primaryKey({ columns: [table.serviceId, table.partyId], name: "party_service_pkey"}),
]);

export const partyServiceRelations = relations(partyService, ({ one }) => ({

    party: one(party, {fields: [partyService.partyId], references: [party.id]}),
    service: one(service, {fields: [partyService.serviceId], references: [service.id]}),
    
}))
