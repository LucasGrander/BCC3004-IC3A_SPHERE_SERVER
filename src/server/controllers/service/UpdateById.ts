import { type Request, type RequestHandler, type Response } from "express";
import { bodyUpdateSchema, getServiceById, paramsSchema, updateServiceById, type UpdatedService } from "../../../database/schema/service";
import { StatusCodes } from "http-status-codes";
import { validate } from "../../shared/middleware";


export const updateByIdValidator: RequestHandler = validate({ params: paramsSchema, body: bodyUpdateSchema });

export const updateById = async (req: Request<{}, {}, UpdatedService>, res: Response) => {

    if (req.headers.personRole !== 'Fornecedor') {
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
                default: "Você só pode atualizar seus serviços."
            }
        });

    }

    const result = await updateServiceById(req.validatedParams.id, req.validatedBody);

    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        });
    }

    return res.status(StatusCodes.NO_CONTENT).json(result);

}