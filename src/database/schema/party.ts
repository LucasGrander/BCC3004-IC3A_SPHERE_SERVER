import { boolean, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { person } from "./person";
import { relations } from "drizzle-orm";
import { pgEnum } from "drizzle-orm/pg-core";
import { partyService } from "./partyService";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import z from "zod";


export const partyTypes = [
    "Pool Party",
    "Eletrônica",
    "Chá Revelação",
    "Confraternização",
    "Formatura",
    "Casamento",
    "Aniversário",
    "Festa Infantil",
    "Debutante",
    "Jantar de Gala",
    "Baile de Máscaras",
    "Festival de Música",
    "Karaokê",
    "Festa Fantasia",
    "Noite de Jogos",
    "Churrasco",
    "Luau",
    "Festa Temática",
    "Festa Junina",
    "Réveillon",
    "Natal",
    "Halloween",
    "Festa Sertaneja",
    "Festa Rock",
    "Festa Samba",
    "Sunset",
    "Evento Empresarial",
    "Batizado",
    "Festa Romântica",
    "Festa Universitária"

] as const;


export const partyType = pgEnum('party_type', partyTypes);


export const party = pgTable("party", {

    id: serial().primaryKey().notNull(),
    name: text('name').notNull(),
    date: timestamp('date', { mode: "string" }).notNull(),
    street: text('address_street').notNull(),
    number: text('address_number').notNull(),
    complement: text('address_complement'),
    isDeleted: boolean().default(false),
    neighborhood: text('address_neighborhood').notNull(),
    city: text('address_city').notNull(),
    type: partyType('party_type').notNull(),
    person_id: integer('person_id').references(() => person.id, { onDelete: 'cascade' }).notNull(),

});

export const partyRelations = relations(party, ({ one, many }) => ({

    person: one(person, { fields: [party.person_id], references: [person.id] }),
    partyService: many(partyService)

}));


const dateValidationSchema = z.string().superRefine((val, ctx) => {
    // 1. Verifica o Formato (Regex)
    // Se falhar aqui, adiciona o erro e RETORNA (para de verificar o resto)
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(val)) {
        ctx.addIssue({
            code: "custom",
            message: "Formato inválido. Use YYYY-MM-DDTHH:MM (ex: 2025-11-25T14:30)",
        });
        return z.NEVER;
    }

    // 2. Verifica se a Data é Real e se está no Futuro
    const date = new Date(val);
    const now = new Date();

    // Verificação de data inválida (ex: 2025-02-30)
    if (isNaN(date.getTime())) {
        ctx.addIssue({
            code: "custom",
            message: "Data inválida (esse dia não existe).",
        });
        return z.NEVER;
    }

    // Verificação de passado
    if (date <= now) {
        ctx.addIssue({
            code: "custom",
            message: "A data e hora devem ser no futuro!",
        });
        return z.NEVER;
    }
});

export const bodyCreateSchema = createInsertSchema(party)
    .extend({
        name: z.string().min(5, "Nome muito curto!"),

        date: dateValidationSchema,

        street: z.string().min(4, "Nome da rua muito curto! Ex: Rua ..."),
        number: z.string().min(1, "Número muito curto!"),
        complement: z.string().min(1, "Complemento muito curto!"), //.max(..., "Complemento longo demais!")
        neighborhood: z.string().min(4, "Nome do Bairro muito curto!"),
        city: z.string().min(4, "Nome da Cidade muito curto"),
        type: z.enum(partyTypes, "Categoria de Festa inválida!"),
        person_id: z.number("O id do Organizador deve ser um número").gt(0, "Id de pessoa inválido!").optional(),
    });

export const bodyUpdateSchema = createUpdateSchema(party)
    .pick({
        name: true,
        date: true,
        street: true,
        complement: true,
        neighborhood: true,
        city: true,
        type: true
    })
    .extend({
        name: z.string().min(5, "Nome muito curto!").optional(),
        date: dateValidationSchema.optional(),
        street: z.string().min(4, "Nome da rua muito curto! Ex: Rua ...").optional(),
        number: z.string().min(1, "Número muito curto!").optional(),
        complement: z.string().min(1, "Complemento muito curto!").optional(), //.max(..., "Complemento longo demais!")
        neighborhood: z.string().min(4, "Nome do Bairro muito curto!").optional(),
        city: z.string().min(4, "Nome da Cidade muito curto").optional(),
        type: z.enum(partyTypes, "Categoria de Festa inválida!").optional(),
    }).strict();

export const selectPartySchema = createSelectSchema(party).omit({ isDeleted: true });

export const paramsSchema = z.object({

    id: z.coerce.number().int().positive()

})

export const querySchema = z.object({

    page: z.coerce.number().int().gt(0).optional().default(1),
    limit: z.coerce.number().int().gt(0).positive().optional().default(10),
    filter: z.string().optional()

}).strict();

export type NewParty = z.infer<typeof bodyCreateSchema>;
export type UpdateParty = z.infer<typeof bodyUpdateSchema>;
export type SelectParty = z.infer<typeof selectPartySchema>;
export type Query = z.infer<typeof querySchema>;
export type Params = z.infer<typeof paramsSchema>;
