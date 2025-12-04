import { type Request, type RequestHandler, type Response } from "express";
import { bodyUpdateSchema, getPartyById, paramsSchema, updatePartyById, type UpdateParty } from "../../../database/schema/party";
import { StatusCodes } from "http-status-codes";
import { validate } from "../../shared/middleware/Validation";


export const updateByIdValidator: RequestHandler = validate({ params: paramsSchema, body: bodyUpdateSchema });

export const updateById = async (req: Request<{}, {}, UpdateParty>, res: Response) => {

    if (req.headers.personRole !== 'organizador') {
        return res.status(StatusCodes.FORBIDDEN).json({
            errors: {
                default: "Função apenas para Organizadores."
            }
        });
    }

    const verifyOwnr = await getPartyById(req.validatedParams.id);

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

    const result = await updatePartyById(req.validatedParams.id, req.validatedBody);

    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        });
    }

    return res.status(StatusCodes.NO_CONTENT).json(result);

}