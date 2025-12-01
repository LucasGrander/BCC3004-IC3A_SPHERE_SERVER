import { type Request, type RequestHandler, type Response } from "express";
import { getPartyById, paramsSchema, type Params } from "../../../database/schema/party";
import { StatusCodes } from "http-status-codes";
import { validate } from "../../shared/middleware/Validation";
import { error } from "console";


export const getByIdValidator: RequestHandler = validate({ params: paramsSchema });

export const getById = async (req: Request, res: Response) => {

    const result = await getPartyById(req.validatedParams.id);

    if(result instanceof Error) { 
        return res.status(StatusCodes.NOT_FOUND).json({
            errors: { 
                default: result.message
            }
        });
    }

    return res.status(StatusCodes.OK).json(result);

}