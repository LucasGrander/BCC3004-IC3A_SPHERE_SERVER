import { boolean, foreignKey, integer, pgEnum, pgTable, primaryKey } from "drizzle-orm/pg-core";
import { service } from "./service";
import { party } from "./party";
import { relations } from "drizzle-orm";

export const status = pgEnum('status', ['Pendente', 'Finalizado', 'Cancelado']);

export const partyService = pgTable("party_service", {
	serviceId: integer("service_id").references(() => service.id, {onDelete: 'restrict'}).notNull(),
	partyId: integer("party_id").references(() => party.id, {onDelete: 'restrict'}).notNull(),
	amount: integer().notNull(),
	hasCanceled: boolean(),
	hasRead: boolean(),
	status: status().notNull(),
}, (table) => [
	primaryKey({ columns: [table.serviceId, table.partyId], name: "party_service_pkey"}),
]);

export const partyServiceRelations = relations(partyService, ({ one }) => ({

    party: one(party, {fields: [partyService.partyId], references: [party.id]}),
    service: one(service, {fields: [partyService.serviceId], references: [service.id]}),
    
}))
