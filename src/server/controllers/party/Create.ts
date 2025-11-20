import { type Request, type RequestHandler, type Response } from "express";
import { bodyCreateSchema, createParty, type NewParty } from "../../../database/schema/party";
import { StatusCodes } from "http-status-codes";
import { validate } from "../../shared/middleware/Validation";

export const createValidator: RequestHandler = validate({ body: bodyCreateSchema })

export const create = async (req: Request<{}, {}, NewParty>, res: Response) => {

        const result = await createParty(req.body);

        // if (typeof result === "object"){ 
        //         result = result.id;
        // }
        
        return res.status(StatusCodes.CREATED).json(result)

}