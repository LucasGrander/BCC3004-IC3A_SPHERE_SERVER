import { type Request, type RequestHandler, type Response } from "express";
import { getAllPartyServices, paramsSchema } from "../../../database/schema/partyService";
import { StatusCodes } from "http-status-codes";
import { validate } from "../../shared/middleware/Validation";
import { getPartyById } from "../../../database/schema/party";


export const getAllValidator: RequestHandler = validate({ params: paramsSchema });

export const getAllPartyServ = async (req: Request, res: Response) => {

    if (req.headers.personRole !== 'organizador') {
        return res.status(StatusCodes.FORBIDDEN).json({
            errors: {
                default: "Função apenas para Organizadores."
            }
        });
    }

    // const verifyOwnr = await getOrganizer(req.validatedParams.id)

    const verifyOwnr = await getPartyById(req.validatedParams.id)

    if (verifyOwnr instanceof Error) {

        return res.status(StatusCodes.NOT_FOUND).json({
            errors: {
                default: verifyOwnr.message
            }
        });

    } else if (req.headers.personId !== verifyOwnr.person_id.toString()) {

        return res.status(StatusCodes.FORBIDDEN).json({
            errors: {
                default: "Você só pode buscar contratos de suas festas."
            }
        });

    }

    const result = await getAllPartyServices(req.validatedParams.id);

    if (result instanceof Error) {
        return res.status(StatusCodes.NOT_FOUND).json({
            errors: {
                default: result.message
            }
        });
    }

    return res.status(StatusCodes.OK).json(result);

}