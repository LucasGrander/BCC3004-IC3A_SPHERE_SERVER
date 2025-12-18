import { and, eq, ilike, inArray, count } from "drizzle-orm";
import { db } from "../database/index"; 
import type { NewParty, SelectParty, UpdateParty, Query } from "../database/schema/party";
import { person } from "../database/schema/person";
import { party } from "../database/schema/party";
import { partyService } from "../database/schema/partyService";

import type { IPartyRepository } from "./interfaces/IPartyRepository";

export class PartyRepository implements IPartyRepository {

    constructor(private readonly database = db) { }

    async create(newParty: NewParty): Promise<SelectParty | Error> {
        try {
            const result = await this.database
                .insert(party)
                .values(newParty)
                .returning();

            const createdParty = result[0];
            if (!createdParty) return new Error('Erro ao inserir registro no banco');

            return createdParty;

        } catch (e: any) {
            console.error("Erro no create:", e);
            if (e.code === '23505') return new Error('Já existe uma festa com esse ID.');
            if (e.code === '23503') return new Error('Pessoa não encontrada.');
            return e instanceof Error ? e : new Error('Erro desconhecido');
        }
    }

    async update(id: number, updatedParty: UpdateParty): Promise<SelectParty | Error> {
        try {
            const result = await this.database
                .update(party)
                .set(updatedParty)
                .where(and(eq(party.isDeleted, false), eq(party.id, id)))
                .returning();

            const item = result[0];
            if (!item) return new Error('Festa não encontrada');
            return item;
        } catch (e: any) {
            console.error("Erro no update:", e);
            return e instanceof Error ? e : new Error('Erro desconhecido');
        }
    }

    async findById(id: number): Promise<SelectParty | Error> {
        try {
            const result = await this.database
                .select() 
                .from(party)
                .where(and(eq(party.isDeleted, false), eq(party.id, id)));

            const foundParty = result[0];
            if (!foundParty) return new Error('Festa não encontrada');
            return foundParty;
        } catch (e: any) {
            console.error("Erro no findById:", e);
            return e instanceof Error ? e : new Error('Erro desconhecido');
        }
    }

    async findAllByPersonId(id: number, page: number, limit: number, filter?: string): Promise<SelectParty[] | Error> {
        try {
            const offset = (page - 1) * limit;

            const cnt = await db.$count(person, eq(person.id, id));

            if (cnt === 0) {
                return new Error('Organizador não encontrado.');
            }

            const result = await this.database
                .select()
                .from(party)
                .where(
                    and(
                        eq(party.isDeleted, false),
                        eq(party.person_id, id),
                        filter ? ilike(party.name, `%${filter}%`) : undefined
                    )
                )
                .limit(limit)
                .offset(offset);

            return result;
        } catch (e: any) {
            console.error("Erro no findAllByPersonId:", e);
            return e instanceof Error ? e : new Error('Erro desconhecido');
        }
    }

    async softDelete(id: number): Promise<void | Error> {
        try {

            const cnt = await db.$count(party, eq(party.id, id));

            if (cnt === 0) {
                return new Error('Festa não encontrada.', { cause: "PARTY_NOT_FOUND" });
            }


            const hasPending = await this.database
                .select({ id: partyService.id })
                .from(partyService)
                .where(
                    and(
                        eq(partyService.partyId, id),
                        inArray(partyService.status, ["Pendente"])
                    )
                )
                .limit(1);

            if (hasPending.length > 0) {
                return new Error("Esta Festa possui serviços pendentes.", { cause: "PARTY_HAS_PENDING_CONTRACTS" });
            }

            const result = await this.database
                .update(party)
                .set({ isDeleted: true })
                .where(eq(party.id, id));

            if (result) return;

            return new Error('Festa não encontrada');

        } catch (e: any) {
            console.error('Erro no softDelete: ', e);
            return e instanceof Error ? e : new Error('Erro desconhecido ao deletar a festa', { cause: "PARTY_NOT_FOUND" });
        }
    }

    async hardDelete(id: number): Promise<void | Error> {
        try {

            const cnt = await db.$count(party, eq(party.id, id));

            if (cnt === 0) {
                return new Error('Festa não encontrada.');
            }

            const result = await this.database
                .delete(party)
                .where(eq(party.id, id))
                .returning({ deletedId: party.id });

            if (result.length === 0) return new Error('Festa não encontrada');

            return;
        } catch (e: any) {
            console.error('Erro no hardDelete: ', e);
            return e instanceof Error ? e : new Error('Erro ao deletar a festa');
        }
    }
}