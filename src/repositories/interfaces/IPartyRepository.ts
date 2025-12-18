import type{ NewParty, SelectParty, UpdateParty, Query } from "../../database/schema/party";

export interface IPartyRepository {
    create(data: NewParty): Promise<SelectParty | Error>;
    update(id: number, data: UpdateParty): Promise<SelectParty | Error>;
    findById(id: number): Promise<SelectParty | Error>;
    findAllByPersonId(personId: number, page: number, limit: number, filter?: string): Promise<SelectParty[] | Error>;
    softDelete(id: number): Promise<void | Error>;
    hardDelete(id: number): Promise<void | Error>;
}