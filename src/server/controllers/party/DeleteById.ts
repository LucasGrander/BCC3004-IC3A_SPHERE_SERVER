import { type Request, type RequestHandler, type Response } from "express";
import { deletePartyById, paramsSchema, querySchema, type Params } from "../../../database/schema/party";
import { StatusCodes } from "http-status-codes";
import { validate } from "../../shared/middleware/Validation";


export const deleteByIdValidator: RequestHandler = validate({ params: paramsSchema });

export const deleteById = async (req: Request, res: Response) => {


    console.log(req.validatedParams);

    const result = await deletePartyById(req.validatedParams.id);

    return res.status(StatusCodes.NO_CONTENT).send();

}