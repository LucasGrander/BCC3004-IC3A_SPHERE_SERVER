import { type Request, type RequestHandler, type Response } from "express";
import { paramsSchema } from "../../../database/schema/party";
import { StatusCodes } from "http-status-codes";
import { validate } from "../../shared/middleware/Validation";
import { PartyRepository } from "../../../repositories/PartyRepository";

export const getByIdValidator: RequestHandler = validate({ params: paramsSchema });

export const getById = async (req: Request, res: Response) => {

    const partyRepo = new PartyRepository()

    if (req.headers.personRole !== 'organizador') {
        return res.status(StatusCodes.FORBIDDEN).json({
            errors: {
                default: "Função apenas para Organizadores."
            }
        });
    }

    const verifyOwnr = await partyRepo.findById(req.validatedParams.id);

    if (verifyOwnr instanceof Error) {
        return res.status(StatusCodes.NOT_FOUND).json({
            errors: {
                default: verifyOwnr.message
            }
        });
    }else if (req.headers.personId !== verifyOwnr.person_id.toString()) {
        return res.status(StatusCodes.FORBIDDEN).json({
            errors: {
                default: "Você só pode consultar suas festas."
            }
        });

    }

    return res.status(StatusCodes.OK).json(verifyOwnr);

}