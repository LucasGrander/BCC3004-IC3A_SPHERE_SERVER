import { type Request, type RequestHandler, type Response } from "express";
import { bodyCreateSchema, createContract, type NewContract } from "../../../database/schema/partyService";
import { StatusCodes } from "http-status-codes";
import { validate } from "../../shared/middleware/Validation";

export const createValidator: RequestHandler = validate({ body: bodyCreateSchema })

export const create = async (req: Request<{}, {}, NewContract>, res: Response) => {
        
        if (req.headers.personRole !== 'organizador') {
                return res.status(StatusCodes.FORBIDDEN).json({
                        errors: {
                                default: "Função apenas para Organizadores."
                        }
                });
        }

        const result = await createContract(req.validatedBody);

        if (result instanceof Error) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                        errors: {
                                default: result.message
                        }
                });
        }

        return res.status(StatusCodes.CREATED).json(result);

}