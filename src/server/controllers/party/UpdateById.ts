import { type Request, type RequestHandler, type Response } from "express";
import { bodyUpdateSchema, paramsSchema, type UpdateParty } from "../../../database/schema/party";
import { StatusCodes } from "http-status-codes";
import { validate } from "../../shared/middleware/Validation";
import { PartyRepository } from "../../../repositories/PartyRepository";


export const updateByIdValidator: RequestHandler = validate({ params: paramsSchema, body: bodyUpdateSchema });

export const updateById = async (req: Request<{}, {}, UpdateParty>, res: Response) => {

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
    } else if (req.headers.personId !== verifyOwnr.person_id.toString()) {
        return res.status(StatusCodes.FORBIDDEN).json({
            errors: {
                default: "Você só pode atualizar suas festas."
            }
        });

    }

    const result = await partyRepo.update(req.validatedParams.id, req.validatedBody);

    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        });
    }

    return res.status(StatusCodes.NO_CONTENT).json(result);

}