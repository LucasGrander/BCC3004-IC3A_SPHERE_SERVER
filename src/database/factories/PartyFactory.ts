import type { NewParty } from "../schema/party";

type PartyInputData = Omit<NewParty, 'person_id'>;

export class PartyFactory {


    public static create(data: PartyInputData,  organizerId: number):NewParty {

        const partyInstance: NewParty = {

            id: data.id,
            name: data.name,
            date: data.date,
            street: data.street,
            number: data.number,
            complement: data.complement,
            neighborhood: data.neighborhood,
            city: data.city,
            type: data.type,
            person_id: organizerId
        };


        return partyInstance;
    }
}