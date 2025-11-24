import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { person } from "./person";
import { and, eq, ilike, relations } from "drizzle-orm";
import { pgEnum } from "drizzle-orm/pg-core";
import { partyService } from "./partyService";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import z from "zod";
import { db } from "..";


export const partyTypes = [

    "pool_party",
    "eletronica",
    "aniversario",
    "cha_revelacao",
    "confraternizacao",
    "formatura",
    "casamento",

] as const;


export const partyType = pgEnum('party_type', partyTypes);


export const party = pgTable("party", {

    id: serial().primaryKey().notNull(),
    name: text('name').notNull(),
    date: timestamp('date', { mode: "string" }).notNull(),
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

export const bodyCreateSchema = createInsertSchema(party)
    .omit({
        id: true
    })
    .extend({
        name: z.string().min(5, "Nome muito curto!"),

        date: z.coerce
            .date()
            .min(new Date(), "Data passada!")
            .transform(d => d.toISOString().split("T")[0])
            .pipe(z.string()), // YYYY-MM-DD

        street: z.string().min(4, "Nome da rua muito curto! Ex: Rua ..."),
        number: z.string().min(1, "Número muito curto!"),
        complement: z.string().min(5, "Complemento muito curto!"), //.max(..., "Complemento longo demais!")
        neighborhood: z.string().min(5, "Nome do Bairro muito curto!"),
        city: z.string().min(5, "Nome da Cidade muito curto"),
        type: z.enum(partyTypes, "Categoria de Festa inválida!"),
        person_id: z.number().gt(0, "Id de pessoa inválido!"),
    });

export const bodyUpdateSchema = createUpdateSchema(party)
    .omit({
        id: true,
        person_id: true,
    })
    .extend({
        name: z.string().min(5, "Nome muito curto!"),
        
         date: z.coerce
            .date()
            .min(new Date(), "Data passada!")
            .transform(d => d.toISOString().split("T")[0])
            .pipe(z.string()), // YYYY-MM-DD

        street: z.string().min(4, "Nome da rua muito curto! Ex: Rua ..."),
        number: z.string().min(1, "Número muito curto!"),
        complement: z.string().min(5, "Complemento muito curto!"), //.max(..., "Complemento longo demais!")
        neighborhood: z.string().min(5, "Nome do Bairro muito curto!"),
        city: z.string().min(5, "Nome da Cidade muito curto"),
        type: z.enum(partyTypes, "Categoria de Festa inválida!"),
    });

export const selectPartySchema = createSelectSchema(party);

export const paramsSchema = z.object({

    id: z.coerce.number().int().positive().nonoptional()

})

export const querySchema = z.object({

    page: z.coerce.number().int().gt(0).optional().default(1),
    limit: z.coerce.number().int().gt(0).positive().optional().default(10),
    filter: z.string().optional()

}).strict();

export type NewParty = z.infer<typeof bodyCreateSchema>;
export type UpdateParty = z.infer<typeof bodyUpdateSchema>;
export type SelectParty = z.infer<typeof selectPartySchema>;
export type Query = z.infer<typeof querySchema>
export type Params = z.infer<typeof paramsSchema>


export const createParty = async (newParty: NewParty) =>
    await db
        .insert(party)
        .values(newParty)
        .returning({
            id: party.id,
            name: party.name,
            date: party.date,
            street: party.street,
            number: party.number,
            complement: party.complement,
            neighborhood: party.neighborhood,
            city: party.city,
            type: party.type
        });

export const updatePartyById = async (id: number, updatedParty: UpdateParty) => 
    await db
        .update(party)
        .set(updatedParty)
        .where(eq(party.person_id, id))
        .returning({
            id: party.id,
            name: party.name,
            date: party.date,
            street: party.street,
            number: party.number,
            complement: party.complement,
            neighborhood: party.neighborhood,
            city: party.city,
            type: party.type
        })

export const getAllPersonPartyById = async (id: number, page: number, limit: number, filter?: string) =>{

    const offset = (page - 1) * limit;
    
    return await db   
        .select()
        .from(party)
        .where(
            and(
                eq(party.person_id, id),
                filter ? ilike(party.name, `%${filter}`) : undefined
            )
        )
        .limit(limit)
        .offset(offset)

} 
  
export const getPartyById = async (id: number) => 
    await db 
        .select({
            name: party.name,
            date: party.date,
            street: party.street,
            number: party.number,
            complement: party.complement,
            neighborhood: party.neighborhood,
            city: party.city,
            type: party.type
        }).from(party).where(eq(party.id, id));

export const deletePartyById = async (id: number) =>
    await db
        .delete(party)
        .where(eq(party.id, id))
        .returning({
            deletedId: party.id
        })