import { type Request, type RequestHandler, type Response } from "express";
import { bodyCreateSchema, createService, type NewService } from "../../../database/schema/service";
import { StatusCodes } from "http-status-codes";
import { validate } from "../../shared/middleware";

export const createValidator: RequestHandler = validate({ body: bodyCreateSchema })

export const create = async (req: Request<{}, {}, NewService>, res: Response) => {
        
        if (req.headers.personRole !== 'Fornecedor') {
                return res.status(StatusCodes.FORBIDDEN).json({
                        errors: {
                                default: "Função apenas para Fornecedores."
                        }
                });
        }

        console.log(req.headers.personId)
        
        const result = await createService({...req.validatedBody, person_id: Number(req.headers.personId)});

        if (result instanceof Error) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                        errors: {
                                default: result.message
                        }
                });
        }

        return res.status(StatusCodes.CREATED).json(result);

}