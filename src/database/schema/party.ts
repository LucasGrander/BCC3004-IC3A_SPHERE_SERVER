import { date, foreignKey, integer, pgTable, serial, text } from "drizzle-orm/pg-core";
import { address } from "./address";
import { person } from "./person";
import { relations } from "drizzle-orm";
import { pgEnum } from "drizzle-orm/pg-core";
import { partyService } from "./partyService";


export const partyType= pgEnum('party_type', 
    [
        'PoolParty', 
        'Eletrônica',
        'Aniversário',
        'Chá Revelação',
        'Confraternização',
        'Formatura',
        'Casamento',
        
    ])


export const party = pgTable("party", {

    id: serial().primaryKey().notNull(),
    name: text('name').notNull(),
    date: date().notNull(),
    type: partyType('party_type').notNull(),
    person_id: integer('person_id').references(() => person.id, {onDelete: 'cascade'}).notNull(),
    address_id: integer('address_id').references(() => address.id, {onDelete: 'cascade'}).notNull()
    
});

export const partyRelations = relations(party, ({ one, many }) => ({

    address: one(address, {fields: [party.address_id], references: [address.id]}),
    person: one(person,{fields: [party.person_id], references: [person.id]} ),
    partyService: many(partyService)

}));

