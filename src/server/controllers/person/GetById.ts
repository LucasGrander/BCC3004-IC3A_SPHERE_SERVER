import type { Request, RequestHandler, Response } from "express";
import { validate } from "../../shared/middleware/Validation";
import { getPersonById, paramsSchema } from "../../../database/schema/person";
import { StatusCodes } from "http-status-codes";


export const getByIdValidator: RequestHandler = validate({ params: paramsSchema})

export const getById = async (req: Request, res: Response) => {

    const result = await getPersonById(req.validatedParams.id);

    if (result instanceof Error) {
        return res.status(StatusCodes.NOT_FOUND).json({
            errors: {
                default: result.message
            }
        });
    }

    return res.status(StatusCodes.OK).json(result);
}