import { boolean, integer, pgTable, serial, text } from "drizzle-orm/pg-core"
import { person } from "./person";
import { partyService } from "./partyService";
import { db } from "..";
import { desc, eq, sql} from "drizzle-orm";
import { party } from "./party";
import { service } from "./service";
import z from "zod";


export const notification = pgTable("notification", {

    id: serial().primaryKey().notNull(),
    personId: integer("person_id").references(() => person.id, { onDelete: 'cascade' }).notNull(), // id do fornecedor
    contractId: integer("contract_id").references(() => partyService.id, { onDelete: 'cascade' }).notNull(),
    hasRead: boolean().default(false),
    hasDelivered: boolean().default(false),
    canceledIn: text().notNull()

});
    
export const bodyUpdateSchema = z.object(notification)
    .pick({
        hasRead: true,
    })
    .extend({
        hasRead: z.boolean()
    })

export const paramsSchema = z.object({

    id: z.coerce.number().int().positive().optional(),

})

export type UpdatedNotification = z.infer<typeof bodyUpdateSchema>
export type Params = z.infer<typeof paramsSchema>


export const getAllNotifications = async (fornecerId: number) => {

    try {

        const result = await db
            .select({

                notificationId: notification.id,
                organizerPhone: person.phone,
                serviceName: service.name,
                partyName: party.name,
                partyDate: party.date,
                canceledIn: notification.canceledIn,
                hasRead: notification.hasRead
                
            })
            .from(notification)
            .innerJoin(partyService, eq(partyService.id, notification.contractId))
            .innerJoin(party, eq(partyService.partyId, party.id))
            .innerJoin(person, eq(party.person_id, person.id))
            .innerJoin(service, eq(partyService.serviceId, service.id))
            .where(eq(notification.personId, fornecerId))
            .orderBy(desc(notification.canceledIn))
        
        if (!result) {
            return new Error("Erro ao buscar notificações.")
        }

        console.log(result)

        return result

    } catch (e: any) {

        console.log("Erro no getAllNotifications:", e);

		if (e instanceof Error) {
			return e;
		}

		return new Error('Erro desconhecido ao buscar notificações.');

    }

}

export const getFornecer = async (notificationId: number) => {

	try {

		const result = await db
			.select({
				fornecerId: notification.personId
			})
			.from(notification)
			.where(eq(notification.id, notificationId))
			.limit(1);

		const got = result[0];

		if (!got) {
			return new Error('Notificação não encontrada')
		}

		return got;

	} catch (e) {

		console.log("Erro no getFornecer:", e);


		if (e instanceof Error) {
			return e;
		}

		return new Error('Erro desconhecido ao verificar ownership da notificação.');

	}
}


export const readNotificationById = async (notificationId: number) => {
    try {
        
        const result = await db
            .update(notification)
            .set({ hasRead: sql`NOT ${notification.hasRead}` })
            .where(eq(notification.id, notificationId))
            .returning()

        const readNotification = result[0]

        if(!readNotification) {
            return new Error("Notificação não encontrada.", {cause: "NOT_FOUND"})
        }

    } catch (e) {

		console.log("Erro no readNotification:", e);

		if (e instanceof Error) {
			return e;
		}

		return new Error('Erro desconhecido ao ler notificação');
        
    }
}
