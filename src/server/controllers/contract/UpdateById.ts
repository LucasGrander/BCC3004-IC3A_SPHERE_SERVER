import { type Request, type RequestHandler, type Response } from "express";
import { StatusCodes } from "http-status-codes";
import { validate } from "../../shared/middleware/Validation";
import { bodyUpdateSchema, getOrganizer, paramsSchema, updateContractById, type UpdatedContract } from "../../../database/schema/partyService";

export const updateByIdValidator: RequestHandler = validate({ params: paramsSchema, body: bodyUpdateSchema });

export const updateById = async (req: Request<{}, {}, UpdatedContract>, res: Response) => {

    if (req.headers.personRole !== 'organizador') {
        return res.status(StatusCodes.FORBIDDEN).json({
            errors: {
                default: "Função apenas para organizadores."
            }
        });
    }

    const verifyOwnr = await getOrganizer(req.validatedParams.id)

    if (verifyOwnr instanceof Error) {

        return res.status(StatusCodes.NOT_FOUND).json({
            errors: {
                default: verifyOwnr.message
            }
        });

    } else if (req.headers.personId !== verifyOwnr.organizerId.toString()) {

        return res.status(StatusCodes.FORBIDDEN).json({
            errors: {
                default: "Você só pode cancelar seus contratos."
            }
        });

    }


    const result = await updateContractById(req.validatedParams.id, req.validatedBody)

    if (result instanceof Error) {

        if (result.cause === "CONTRACT_IS_DONE") {
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

    return res.status(StatusCodes.NO_CONTENT).send("Contrato Atualizado.");

}