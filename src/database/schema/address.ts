// import { eq, relations, type Update } from "drizzle-orm";
// import { pgTable, serial, text } from "drizzle-orm/pg-core";
// import { party } from "./party";
// import { createInsertSchema, createSelectSchema} from "drizzle-zod";
// import z from "zod";
// import { db } from "..";


// export const address = pgTable("address", {

//     id: serial().primaryKey().notNull(),
//     street: text('street').notNull(),
//     number: text().notNull(),
//     complement: text('address_complement'),
//     neighborhood: text('neighborhood').notNull(),
//     city: text('city').notNull(),

// })

// export const addressRelations = relations(address, ({ many }) => ({

//     party: many(party),
    
// }));

// export const bodySchema = createInsertSchema(address)
//     .omit({ id: true })
//     .extend({
//         street: z.string().min(4, "Nome da rua muito curto! Ex: Rua ..."),
//         number: z.string().min(1, "Número muito curto!"),
//         complement: z.string().min(5, "Complemento muito curto!"), //.max(..., "Complemento longo demais!")
//         neighborhood: z.string().min(5, "Nome do Bairro muito curto!"),
//         city: z.string().min(5, "Nome da Cidade muito curto")
//     });


// // export const bodyUpdateSchema = createUpdateSchema(address) 
// // /TODO: Caso necessário a alteração de apenas alguns dos campos, fazemos um body schema específico, do contrário utilizamos apenas o schema acima.

// export const selectPersonSchema = createSelectSchema(address)


// export const paramsSchema = z.object({
//     id: z.coerce.number().int().positive()
// })

// export type NewAddress = z.infer<typeof bodySchema>;
// export type UpdateAddress = z.infer<typeof bodySchema>;
// export type SelectAddress = z.infer<typeof selectPersonSchema>;
// export type Params = z.infer<typeof paramsSchema>;

// export const createAddress = async (newAddress: NewAddress) => 
//         await db
//             .insert(address)
//             .values(newAddress)
//             .returning({
//                 id: address.id,
//             });

// export const updateAddressById = async (id: number, updatedAddress: UpdateAddress) => 
//         await db
//             .update(address)
//             .set(updatedAddress)
//             .where(eq(address.id, id))
//             .returning({
//                 id: address.id,
//                 street: address.street,
//                 number: address.number,
//                 complement: address.complement,
//                 neighborhood: address.neighborhood,
//                 city: address.city
//             });

// export const getAddressById = async (id: number) => 
//         await db
//             .select({
//                 street: address.street,
//                 number: address.number,
//                 complement: address.complement,
//                 neighborhood: address.neighborhood,
//                 city: address.city
//             }).from(address).where(eq(address.id, id));
