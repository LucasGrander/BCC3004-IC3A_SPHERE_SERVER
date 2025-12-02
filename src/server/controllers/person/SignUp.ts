import type { Request, RequestHandler, Response } from "express";
import { validate } from "../../shared/middleware/Validation";
import { bodyCreateSchema, createPerson, type NewPerson } from "../../../database/schema/person";
import { StatusCodes } from "http-status-codes";


export const signUpValidator: RequestHandler = validate({body: bodyCreateSchema });

export const signUp = async(req: Request<{}, {}, NewPerson>, res:Response ) => {

    const result = await createPerson(req.validatedBody);
    
    if(result instanceof Error){
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors:{
                default: result.message
            }
        })
    }
    return res.status(StatusCodes.CREATED).json(result);
}   
