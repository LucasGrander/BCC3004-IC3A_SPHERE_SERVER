import { type Request, type RequestHandler, type Response } from "express";
import { getPartyById, paramsSchema, type Params } from "../../../database/schema/party";
import { StatusCodes } from "http-status-codes";
import { validate } from "../../shared/middleware/Validation";

export const getByIdValidator: RequestHandler = validate({ params: paramsSchema });

export const getById = async (req: Request, res: Response) => {

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
    }else if (req.headers.personId !== verifyOwnr.person_id.toString()) {
        return res.status(StatusCodes.FORBIDDEN).json({
            errors: {
                default: "Você só pode consultar suas festas."
            }
        });

    }

    return res.status(StatusCodes.OK).json(verifyOwnr);

}