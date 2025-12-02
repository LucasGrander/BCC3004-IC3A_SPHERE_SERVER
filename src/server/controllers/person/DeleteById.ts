import type { Request, RequestHandler, Response } from "express";
import { validate } from "../../shared/middleware/Validation";
import { deletePersonById, paramsSchema } from "../../../database/schema/person";
import { StatusCodes } from "http-status-codes";


export const deleteByIdValidator: RequestHandler = validate({ params: paramsSchema});

export const deleteById = async (req: Request, res: Response) => {

    const result = await deletePersonById(req.validatedParams.id);

    if (result instanceof Error) {
        return res.status(StatusCodes.NOT_FOUND).json({
            errors: {
                default: result.message
            }
        });
    }

    return res.status(StatusCodes.NO_CONTENT).send();
    
}