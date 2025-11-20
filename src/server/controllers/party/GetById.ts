import { type Request, type RequestHandler, type Response } from "express";
import { getPartyById, paramsSchema, type Params } from "../../../database/schema/party";
import { StatusCodes } from "http-status-codes";
import { validate } from "../../shared/middleware/Validation";


export const getByIdValidator: RequestHandler = validate({ params: paramsSchema });

export const getById = async (req: Request, res: Response) => {

    console.log(req.validatedParams);

    const result = await getPartyById(req.validatedParams.id);
    return res.status(StatusCodes.OK).json(result)

}