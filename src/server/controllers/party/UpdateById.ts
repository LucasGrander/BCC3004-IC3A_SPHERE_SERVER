import { type Request, type RequestHandler, type Response } from "express";
import { bodyUpdateSchema, paramsSchema, updatePartyById, type Params, type UpdateParty } from "../../../database/schema/party";
import { StatusCodes } from "http-status-codes";
import { validate } from "../../shared/middleware/Validation";



export const updateByIdValidator: RequestHandler = validate({ params: paramsSchema, body: bodyUpdateSchema});

export const updateById = async (req: Request<{}, {}, UpdateParty>, res: Response) => {

    console.log(req.validatedParams, req.validatedBody);

    const result = await updatePartyById(req.validatedParams.id, req.body);
    return res.status(StatusCodes.NO_CONTENT).json(result)

}