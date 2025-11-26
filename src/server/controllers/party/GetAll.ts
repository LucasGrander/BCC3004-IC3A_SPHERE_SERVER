import { type Request, type RequestHandler, type Response } from "express";
import { getAllPersonPartyById, paramsSchema, querySchema, type Params, type Query } from "../../../database/schema/party";
import { StatusCodes } from "http-status-codes";
import { validate } from "../../shared/middleware/Validation";



export const getAllValidator: RequestHandler = validate({ params: paramsSchema, query: querySchema });

export const getAll = async (req: Request, res: Response) => {

    const { id } = req.validatedParams;

    const { page, limit, filter } = req.validatedQuery;

    const result = await getAllPersonPartyById(id, page, limit, filter);

    if(result instanceof Error) {
        return res.status(StatusCodes.NOT_FOUND).json({
            errors: {
                default: result.message
            }
        });
    }

    return res.status(StatusCodes.OK).json(result);

}