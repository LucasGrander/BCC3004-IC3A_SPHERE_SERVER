import { boolean, decimal, integer, pgEnum, pgTable, serial, text } from "drizzle-orm/pg-core";
import { person } from "./person";
import { and, eq, ilike, relations } from "drizzle-orm";
import { partyService } from "./partyService";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import z from "zod";
import { db } from "..";


export const serviceTypes = [

    // Alimentação
    'Buffet',
    'Bebidas',
    'Barman',
    'Confeitaria',  // Bolos e doces finos (geralmente separado do buffet)
    'Churrasqueiro',     

    // Estrutura e Ambiente
    'Decoração',        // Flores, arranjos, cenografia
    'Mobília',
    'Iluminação',
    'Sonorização',      // Equipamentos de som (diferente dos artistas)
    'Infra',            // Palcos, tendas, geradores, pisos
    'Brinquedos',       // Cama elástica, Infláveis

    // Diversão e Mídia
    'Entretenimento',   // DJs, Bandas, Personagens
    'Recreação',        // Monitores infantis, brinquedos
    'Fotografia',
    'Filmagem',         // Vídeo, Drone

    // Organização e Apoio
    'Assessoria',       // Cerimonialistas e organizadores
    'Segurança',
    'Limpeza',          // Equipe de limpeza pós/pré evento
    'Staff',            // Garçons extras, recepcionistas, valets
    'Garçons',
    'Entreterimento',

    // Detalhes
    'Papelaria',        // Convites, menus
    'Lembrancinhas',    // Brindes personalizados
    'Beleza',           // Maquiagem e Cabelo (dia da noiva/debutante)
    'Aluguel de Trajes', // Vestidos, Ternos
    'Transporte'        // Limousines, vans para convidados

] as const;

export const serviceType = pgEnum('service_type', serviceTypes);

export const service = pgTable("service", {

    id: serial().primaryKey().notNull(),
    name: text('name').notNull(),
    description: text('description').notNull(),
    type: serviceType('service_type').notNull(),
    price: decimal('price').notNull(),
    isDeleted: boolean().default(false),
    person_id: integer('person_id').references(() => person.id, { onDelete: 'cascade' }).notNull()

});

export const serviceRelations = relations(service, ({ one, many }) => ({

    person: one(person, { fields: [service.person_id], references: [person.id] }),
    partyService: many(partyService)

}));

export const bodyCreateSchema = createInsertSchema(service)
    .extend({
        name: z.string("O nome deve ser um texto!").min(5, "Nome muito curto!").max(25, "Nome muito longo!"),
        description: z.string("A descrição deve ser um texto!").min(10, "Descrição muito curta!").max(40, "Descrição muito longa!"),
        type: z.enum(serviceTypes, "Categoria de Serviço inválida!"),
        price: z.string("O preço é obrigatório").regex(/^\d+(\.\d{2})?$/, "O preço deve ter ou 2 casas decimais ou nenhuma (ex: 10.99)").refine((val) => parseFloat(val) > 0, {
            message: "O valor deve ser maior que zero (ex: 0.50)"
        }),
        person_id: z.number("O id do Fornecedor deve ser um número").gt(0, "Id de pessoa inválido!").optional(),
    })

export const bodyUpdateSchema = createUpdateSchema(service)
    .omit({
        id: true,
        person_id: true,
        isDeleted: true
    })
    .extend({
        name: z.string("O nome deve ser um texto!").min(5, "Nome muito curto!").max(20, "Nome muito longo!").optional(),
        description: z.string("A descrição deve ser um texto!").min(10, "Descrição muito curta!").max(40, "Descrição muito longa!").optional(),
        type: z.enum(serviceTypes, "Categoria de Serviço inválida!").optional(),
        price: z.string("O preço é obrigatório")
            .regex(/^\d+(\.\d{2})?$/, "O preço deve ter até 2 casas decimais (ex: 10.99)").refine((val) => parseFloat(val) > 0, {
                message: "O valor deve ser maior que zero (ex: 0.50)"
            }).optional()
    }).strict();

export const selectServiceSchema = createSelectSchema(service);

export const paramsSchema = z.object({

    id: z.coerce.number().int().positive()

})

export const querySchema = z.object({

    page: z.coerce.number().int().gt(0).optional().default(1),
    limit: z.coerce.number().int().gt(0).positive().optional().default(10),
    filter: z.string().optional()

}).strict();

export type NewService = z.infer<typeof bodyCreateSchema>
export type UpdatedService = z.infer<typeof bodyUpdateSchema>
export type SelectService = z.infer<typeof selectServiceSchema>
export type Query = z.infer<typeof querySchema>
export type Params = z.infer<typeof paramsSchema>

export const createService = async (newService: NewService): Promise<SelectService | Error> => {

    try {

        const result = await db
            .insert(service)
            .values(newService)
            .returning();

        const createdService = result[0];

        if (!createdService) {
            return new Error('Erro ao inserir registro no banco');
        }

        return createdService;

    } catch (e: any) {

        const code = e.code || e.cause?.code;

        console.log("Erro no createService:", e);

        if (code === '23505') {
            return new Error('Ja existe um serviço com este id.');
        }

        if (code === '23503') {
            return new Error('Pessoa nao encontrada.');
        }

        if (e instanceof Error) {
            return e;
        }

        return new Error('Erro desconhecido ao criar serviço');

    }
}

export const updateServiceById = async (id: number, updatedService: UpdatedService): Promise<SelectService | Error> => {

    try {

        const result = await db
            .update(service)
            .set(updatedService)
            .where(
                and(
                    eq(service.isDeleted, false),
                    eq(service.id, id)
                )
            )
            .returning();

        const updService = result[0];

        if (!updService) {
            return new Error('Serviço não encontrado')
        }

        return updService;

    } catch (e: any) {

        // const code = e.code || e.cause?.code;

        console.log("Erro no updateService:", e);

        if (e instanceof Error) {
            return e;
        }

        return new Error('Erro desconhecido ao atualizar serviço');

    }
}

export const getAllPersonServiceById = async (id: number, page: number, limit: number, filter?: string): Promise<SelectService[] | Error> => {

    try {

        const offset = (page - 1) * limit;

        const cnt = await db.$count(person, eq(person.id, id));

        if (cnt === 0) {
            return new Error('Fornecedor não encontrado.');
        }

        const result = await db
            .select()
            .from(service)
            .where(
                and(
                    eq(service.isDeleted, false),
                    eq(service.person_id, id),
                    filter ? ilike(service.name, `%${filter}%`) : undefined
                )
            )
            .limit(limit)
            .offset(offset);

        if (!result) {
            return new Error('Erro ao buscar registro no banco');
        }

        return result;

    } catch (e: any) {

        console.log("Erro no getAllPersonServiceById:", e);

        //  const code = e.code || e.cause?.code;

        if (e instanceof Error) {
            return e;
        }

        return new Error('Erro desconhecido ao buscar serviços');

    }
}

export const getAllServices = async (page: number, limit: number, filter?: string): Promise<SelectService[] | Error> => {

    try {

        const offset = (page - 1) * limit;

        const result = await db
            .select()
            .from(service)
            .limit(limit)
            .where(
                and(
                    eq(service.isDeleted, false),
                    filter ? ilike(service.name, `%${filter}%`) : undefined,
                    // or()
                )
            )
            .offset(offset);

        if (!result) {
            return new Error('Erro ao buscar registros no banco');
        }

        return result;

    } catch (e: any) {

        console.log("Erro no getAllServices:", e);

        //  const code = e.code || e.cause?.code;

        if (e instanceof Error) {
            return e;
        }

        return new Error('Erro desconhecido ao buscar todos os serviços');

    }
}

export const getServiceById = async (id: number): Promise<SelectService | Error> => {

    try {

        const result = await db
            .select()
            .from(service)
            .where(
                and(
                    eq(service.isDeleted, false),
                    eq(service.id, id)
                )
            )

        const foundService = result[0];

        if (!foundService) {
            return new Error("Serviço não encontrado.")
        }

        return foundService;

    } catch (e: any) {

        console.log("Erro no getServiceById: ", e);

        if (e instanceof Error) {
            return e;
        }

        return new Error("Erro desconhecido ao buscar serviço por id");

    }
}

export const deleteServiceById = async (id: number): Promise<void | Error> => {

    try {

        const cnt = await db.$count(service, eq(service.id, id));

        if (cnt === 0) {
            return new Error('Serviço não encontrado.');
        }

        const result = await db
            .update(service)
            .set({ isDeleted: true })
            .where(eq(service.id, id))
            .returning({
                deletedId: service.id
            });

        if (result) return;

        return new Error('Service não encontrada');

    } catch (e: any) {

        console.log("Erro no deleteServiceById: ", e);

        if (e instanceof Error) {
            return e;
        }

        return new Error("Erro desconhecido ao deletar Serviço.");

    }
}

export const deleteHServiceById = async (id: number): Promise<void | Error> => {

    try {

        const cnt = await db.$count(service, eq(service.id, id));

        if (cnt === 0) {
            return new Error('Serviço não encontrado.');
        }

        const result = await db
            .delete(service)
            .where(eq(service.id, id))
            .returning({
                deletedId: service.id
            });

        if (result) return;

        return new Error('Festa não encontrada');

    } catch (e: any) {

        console.log("Erro no deleteServiceById: ", e);

        if (e instanceof Error) {
            return e;
        }

        return new Error("Erro desconhecido ao deletar Serviço.");

    }
}