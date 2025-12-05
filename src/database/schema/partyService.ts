import { boolean, integer, pgEnum, pgTable, serial, text } from "drizzle-orm/pg-core";
import { service } from "./service";
import { party } from "./party";
import { relations } from "drizzle-orm";

export const contractStatus = ['Pendente', 'Finalizado', 'Cancelado'] as const 

export const status = pgEnum('status', contractStatus);

export const partyService = pgTable("party_service", {
id: serial().primaryKey().notNull(),
	serviceId: integer("service_id").references(() => service.id, { onDelete: 'restrict' }).notNull(),
	partyId: integer("party_id").references(() => party.id, { onDelete: 'restrict' }).notNull(),
		amount: integer().notNull(),
total: text('total').notNull(),
	hasRead: boolean().default(false),
	hasDeliveredNotification: boolean().default(false),
	status: status('contractStatus').notNull().default("Pendente"),
});

export const partyServiceRelations = relations(partyService, ({ one }) => ({

    party: one(party, { fields: [partyService.partyId], references: [party.id] }),
    service: one(service, { fields: [partyService.serviceId], references: [service.id] }),
    
}))
