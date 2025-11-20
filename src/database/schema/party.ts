import { date, foreignKey, integer, pgTable, serial, text } from "drizzle-orm/pg-core";
import { address } from "./address";
import { person } from "./person";
import { relations } from "drizzle-orm";
import { pgEnum } from "drizzle-orm/pg-core";
import { partyService } from "./partyService";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import z from "zod";
import { db } from "..";

export const partyTypes = [

    "PoolParty",
    "Eletrônica",
    "Aniversário",
    "Chá Revelação",
    "Confraternização",
    "Formatura",
    "Casamento",
        
] as const;


export const partyType = pgEnum('party_type', partyTypes);


export const party = pgTable("party", {

    id: serial().primaryKey().notNull(),
    name: text('name').notNull(),
    date: date().notNull(),
    street: text('address_street').notNull(),
    number: text('address_number').notNull(),
    complement: text('address_complement'),
    neighborhood: text('address_neighborhood').notNull(),
    city: text('address_city').notNull(),
    type: partyType('party_type').notNull(),
    person_id: integer('person_id').references(() => person.id, { onDelete: 'cascade' }).notNull(),
    
});

export const partyRelations = relations(party, ({ one, many }) => ({

    person: one(person, { fields: [party.person_id], references: [person.id] }),
    partyService: many(partyService)

}));

