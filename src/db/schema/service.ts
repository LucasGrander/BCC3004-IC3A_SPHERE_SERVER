import { decimal, integer, pgEnum, pgTable, serial, text } from "drizzle-orm/pg-core";
import { person } from "./person";
import { relations } from "drizzle-orm";
import { partyService } from "./partyService";

export const serviceType= pgEnum('service_type', 
    [
        'Buffet', 
        'Bebidas',
        'Mobília',
        'Entreterimento',
        'Iluminação',
        'Infra',
        'Fotografia'
        
    ]);


export const service = pgTable("service", {

    id: serial().primaryKey().notNull(),
    name: text('name').notNull(),
    description: text('description').notNull(),
    type: serviceType('service_type').notNull(),
    price: decimal('price').notNull(),
    person_id: integer('person_id').references(() => person.id, {onDelete: 'cascade'}).notNull()
    
});

export const serviceRelations = relations(service, ({ one, many }) => ({

    person: one(person, {fields: [service.person_id], references: [person.id]}),
    partyService: many(partyService)

}));