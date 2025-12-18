import { type Request, type RequestHandler, type Response } from "express";
import { deleteServiceById, getServiceById, paramsSchema } from "../../../database/schema/service";
import { StatusCodes } from "http-status-codes";
import { validate } from "../../shared/middleware"

export const deleteByIdValidator: RequestHandler = validate({ params: paramsSchema });

export const deleteById = async (req: Request, res: Response) => {

    if (req.headers.personRole !== 'fornecedor') {
        return res.status(StatusCodes.FORBIDDEN).json({
            errors: {
                default: "Função apenas para Fornecedores."
            }
        });
    }

    const verifyOwnr = await getServiceById(req.validatedParams.id);

    if (verifyOwnr instanceof Error) {
        return res.status(StatusCodes.NOT_FOUND).json({
            errors: {
                default: verifyOwnr.message
            }
        });
    } else if (req.headers.personId !== verifyOwnr.person_id.toString()) {
        return res.status(StatusCodes.FORBIDDEN).json({
            errors: {
                default: "Você só pode deletar seus serviços."
            }
        });

    }

    const result = await deleteServiceById(req.validatedParams.id);

    if (result instanceof Error) {

        if (result.cause === "SERVICE_HAS_PENDING_CONTRACTS") {
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