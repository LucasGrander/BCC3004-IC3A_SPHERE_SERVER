import { pgEnum, pgTable, serial, text} from "drizzle-orm/pg-core";
import { eq, relations } from "drizzle-orm";
import { party } from "./party";
import { service } from "./service";


export const roles = pgEnum('person_role', ['Fornecedor', 'Organizador']);

export const person = pgTable("person", {

    id: serial().primaryKey().notNull(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    phone: text('phone'),
    role: roles().notNull(),

});

export const personRelations = relations(person, ({ many }) => ({

    party: many(party),
    service: many(service)

}));

