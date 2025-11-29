import { Many, relations } from "drizzle-orm";
import { pgTable, serial, text } from "drizzle-orm/pg-core";
import { party } from "./party";


export const address = pgTable("address", {

    id: serial().primaryKey().notNull(),
    street: text('street').notNull(),
    number: text().notNull(),
    complement: text('address_complement'),
    neighborhood: text('neighborhood').notNull(),
    city: text('city').notNull(),

})

export const addressRelations = relations(address, ({ many }) => ({

    party: many(party),
    
}));