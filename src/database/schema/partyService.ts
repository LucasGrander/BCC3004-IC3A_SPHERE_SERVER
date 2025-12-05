import { boolean, integer, pgEnum, pgTable, serial, text } from "drizzle-orm/pg-core";
import { service } from "./service";
import { party } from "./party";
import { and, desc, eq, relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import z from "zod";
import { db } from "..";
import { person } from "./person";


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


export const bodyCreateSchema = createInsertSchema(partyService)
	.omit({
		hasRead: true,
		hasDeliveredNotification: true,
	})
	.extend({
		serviceId: z.number("O serviceId deve ser um número"),
		partyId: z.number("O serviceId deve ser um número"),
		amount: z.number("Quantidate precisa ser um número").gt(0, "A quantidade deve ser maior que 0"),
		total: z.string().min(0, "O Total não pode ser nulo.")
	})

export const bodyUpdateSchema = z.object(partyService)
	.pick({
		status: true,
		hasRead: true,
		hasDeliveredNotification: true
	})
	.extend({
		hasDeliveredNotification: z.boolean("Deve ser um booleano").optional(),
		hasRead: z.boolean("Deve ser um booleano").optional(),
		status: z.enum(contractStatus, "Status inválido").optional()
	})

// export const selectContractSchema = z.object(partyService)
// 	.pick({ 

// 	})

export const paramsSchema = z.object({

	id: z.coerce.number().int().positive()

})

export type NewContract = z.infer<typeof bodyCreateSchema>;
export type UpdatedContract = z.infer<typeof bodyUpdateSchema>;
export type Params = z.infer<typeof paramsSchema>


export const createContract = async (newContract: NewContract) => {

	try {

		const result = await db
			.insert(partyService)
			.values(newContract)
			.returning();

		const contracted = result[0];

		if (!contracted) {
			return new Error('Erro ai inserir registro no banco');
		}

		return contracted;

	} catch (e: any) {

		const code = e.code || e.cause?.code;

		console.log("Erro no createContract:", e);

		if (code === '23503') {
			return new Error('Pessoas não encontradas.');
		}

		if (e instanceof Error) {
			return e;
		}

		return new Error('Erro desconhecido ao criar contrato');

	}
}

export const updateContractById = async (id: number, updatedContract: UpdatedContract) => {

	try {

		const result = await db
			.update(partyService)
			.set(updatedContract)
			.where(eq(partyService.id, id))
			.returning()

		const contractUpdated = result[0]

		if (!contractUpdated) {
			return new Error("Contrato não encontrado.")
		}

		return contractUpdated;

	} catch (e) {

		// const code = e.code || e.cause?.code;

		console.log("Erro no updateContract:", e);

		if (e instanceof Error) {
			return e;
		}

		return new Error('Erro desconhecido ao atualizar contrato');

	}
}

export const getAllContracts = async (Fid: number) => {

	try {

		const result = await db
			.select({

				contractId: partyService.id,
				amount: partyService.amount,
				serviceName: service.name,
				partyOwner: person.name,
				partyOwnPhone: person.phone,
				partyDate: party.date,
				partyStreet: party.street,
				partyNum: party.number,
				partyNeigh: party.neighborhood,
				partyCity: party.city

			})
			.from(partyService)
			.innerJoin(party, eq(partyService.partyId, party.id))
			.innerJoin(service, eq(partyService.serviceId, service.id))
			.innerJoin(person, eq(party.person_id, person.id))
			.where(
				and(
					eq(service.person_id, Fid)
				)
			)
			.orderBy(desc(party.date)); 

		if (!result) {
			return new Error("Erro ao buscar todos seus contratos.")
		}

		return result

	} catch (e: any) {

		console.log("Erro no getAllContract:", e);

		//  const code = e.code || e.cause?.code;

		if (e instanceof Error) {
			return e;
		}

		return new Error('Erro desconhecido ao buscar todos seus contratos.');

	}
}

export const getAllPartyServices = async (Partyid: number) => {

	try {

		const result = await db
			.select({

				contractId: partyService.id,
				amount: partyService.amount,
				status: partyService.status,
				serviceName: service.name,
				serviceProv: person.name,
				total: partyService.total,

			})
			.from(partyService)
			.innerJoin(service, eq(partyService.serviceId, service.id))
			.innerJoin(person, eq(service.person_id, person.id))
			.innerJoin(party, eq(partyService.partyId, party.id))
			.where(
				and(
					eq(party.id, Partyid)
				)

			)
			.orderBy(desc(party.date));


		if (!result) {
			return new Error("Erro ao buscar os serviços da festa.")
		}

		return result;

	} catch (e: any) {

		console.log("Erro no getAllPartyServices:", e);

		//  const code = e.code || e.cause?.code;

		if (e instanceof Error) {
			return e;
		}

		return new Error('Erro desconhecido ao buscar todos os serviços da festa..');

	}
}


export const getOrganizer = async (contractId: number) => {

	try {

		const result = await db
			.select({
				organizerId: party.person_id
			})
			.from(partyService) 
			.innerJoin(party, eq(party.id, partyService.partyId)) 
			.where(eq(partyService.id, contractId)) 
			.limit(1);

		const got = result[0]; 
		
		console.log(result)
		
		if(!got) { 
			return new Error('Ou tu não é fi du dono ou este contrato não existe')
		}

		return got;

	} catch (e: any) {

		console.log("Erro no getOrganizer:", e);

		//  const code = e.code || e.cause?.code;

		if (e instanceof Error) {
			return e;
		}

		return new Error('Erro desconhecido ao verificar ownership da festa.');

	}
}

export const getFornecer = async (contractId: number) => {

	try {

		const result = await db
			.select({
				fornecerId: service.person_id
			})
			.from(partyService) 
			.innerJoin(service, eq(partyService.serviceId, service.id)) 
			.where(eq(partyService.id, contractId)) 
			.limit(1);

		const got = result[0]; 

		if(!got) { 
			return new Error('Ou tu não é fidudono ou este contrato não existe')
		}

		return got;
		
	} catch (e: any) {

		console.log("Erro no getFornecer:", e);

		//  const code = e.code || e.cause?.code;

		if (e instanceof Error) {
			return e;
		}

		return new Error('Erro desconhecido ao buscar todos os serviços da festa.');

	}
}