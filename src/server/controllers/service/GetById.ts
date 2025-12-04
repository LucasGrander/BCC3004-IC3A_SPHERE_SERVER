import { type Request, type RequestHandler, type Response } from "express";
import { getServiceById, paramsSchema, type Params } from "../../../database/schema/service";
import { StatusCodes } from "http-status-codes";
import { validate } from "../../shared/middleware";

export const getByIdValidator: RequestHandler = validate({ params: paramsSchema });

export const getById = async (req: Request, res: Response) => {

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
    }else if (req.headers.personId !== verifyOwnr.person_id.toString()) {
        return res.status(StatusCodes.FORBIDDEN).json({
            errors: {
                default: "Você só pode consultar seus serviços."
            }
        });

    }

    return res.status(StatusCodes.OK).json(verifyOwnr);

}