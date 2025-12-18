import { type Request, type RequestHandler, type Response } from "express";
import { bodyCreateSchema, type NewParty } from "../../../database/schema/party";
import { StatusCodes } from "http-status-codes";
import { validate } from "../../shared/middleware/Validation";
import { PartyFactory } from "../../../factories/PartyFactory";
import { PartyRepository } from "../../../repositories/PartyRepository";

export const createValidator: RequestHandler = validate({ body: bodyCreateSchema })

export const create = async (req: Request<{}, {}, NewParty>, res: Response) => {

        const partyRepo = new PartyRepository()
        
        if (req.headers.personRole !== 'organizador') {
                return res.status(StatusCodes.FORBIDDEN).json({
                        errors: {
                                default: "Função apenas para Organizadores."
                        }
                });
        }

        const organizerId = Number(req.headers.personId);

        // Design Pattern criacional FACTORY
        const newPartyInstance = PartyFactory.create(req.validatedBody, organizerId)

        // Design Pattern estrutural ADAPTER
        const result = await partyRepo.create(newPartyInstance);

        if (result instanceof Error) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                        errors: {
                                default: result.message
                        }
                });
        }

        return res.status(StatusCodes.CREATED).json(result);

}