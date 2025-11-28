import { type Request, type RequestHandler, type Response } from "express";
import { bodyUpdateSchema, paramsSchema, updatePartyById, type UpdateParty } from "../../../database/schema/party";
import { StatusCodes } from "http-status-codes";
import { validate } from "../../shared/middleware/Validation";


export const updateByIdValidator: RequestHandler = validate({ params: paramsSchema, body: bodyUpdateSchema});

export const updateById = async (req: Request<{}, {}, UpdateParty>, res: Response) => {

    const result = await updatePartyById(req.validatedParams.id, req.validatedBody);

    if(result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        });
    }

    return res.status(StatusCodes.NO_CONTENT).json(result);

}