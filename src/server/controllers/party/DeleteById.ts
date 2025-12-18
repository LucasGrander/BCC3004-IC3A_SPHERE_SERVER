import { type Request, type RequestHandler, type Response } from "express";
import { deletePartyById, getPartyById, paramsSchema } from "../../../database/schema/party";
import { StatusCodes } from "http-status-codes";
import { validate } from "../../shared/middleware/Validation";


export const deleteByIdValidator: RequestHandler = validate({ params: paramsSchema });

export const deleteById = async (req: Request, res: Response) => {

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
                default: "Você só pode deletar suas festas."
            }
        });

    }

    const result = await deletePartyById(req.validatedParams.id);

    if (result instanceof Error) {

        if (result.cause === "PARTY_HAS_PENDING_CONTRACTS") {
            return res.status(StatusCodes.NOT_ACCEPTABLE).json({
                errors: {
                    default: result.message
                }
            });
        }

        return res.status(StatusCodes.NOT_FOUND).json({
            errors: {
                default: result.message
            }
        });
    }

    return res.status(StatusCodes.NO_CONTENT).send();

}