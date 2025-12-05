import { type Request, type RequestHandler, type Response } from "express";
import { bodyCreateSchema, createParty, type NewParty } from "../../../database/schema/party";
import { StatusCodes } from "http-status-codes";
import { validate } from "../../shared/middleware/Validation";

export const createValidator: RequestHandler = validate({ body: bodyCreateSchema })

export const create = async (req: Request<{}, {}, NewParty>, res: Response) => {
        
        if (req.headers.personRole !== 'organizador') {
                return res.status(StatusCodes.FORBIDDEN).json({
                        errors: {
                                default: "Função apenas para Organizadores."
                        }
                });
        }

        const result = await createParty({...req.validatedBody, person_id: Number(req.headers.personId)});

        if (result instanceof Error) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                        errors: {
                                default: result.message
                        }
                });
        }

        return res.status(StatusCodes.CREATED).json(result);

}