import { type Request, type RequestHandler, type Response } from "express";
import { querySchema } from "../../../database/schema/party";
import { StatusCodes } from "http-status-codes";
import { validate } from "../../shared/middleware/Validation";
import { PartyRepository } from "../../../repositories/PartyRepository";

export const getAllValidator: RequestHandler = validate({ query: querySchema });

export const getAll = async (req: Request, res: Response) => {

    const partyRepo = new PartyRepository()

    if (req.headers.personRole !== 'organizador') {
            return res.status(StatusCodes.FORBIDDEN).json({
                errors: {
                    default: "Função apenas para Organizadores."
                }
            });
        }

    const id = Number(req.headers.personId);

    const{ page, limit, filter } = req.validatedQuery;

    const result = await partyRepo.findAllByPersonId(id, page, limit, filter);

    if(result instanceof Error) {
        return res.status(StatusCodes.NOT_FOUND).json({
            errors: {
                default: result.message
            }
        });
    }

    return res.status(StatusCodes.OK).json(result);

}