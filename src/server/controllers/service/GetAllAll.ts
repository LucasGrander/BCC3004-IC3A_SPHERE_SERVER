import { type Request, type Response } from "express";
import { getAServices } from "../../../database/schema/service";
import { StatusCodes } from "http-status-codes";

export const getAllAll = async (req: Request, res: Response) => {

    if (req.headers.personRole !== 'organizador') {
            return res.status(StatusCodes.FORBIDDEN).json({
                errors: {
                    default: "Função apenas para organizadores."
                }
            });
        }

    const result = await getAServices();

    if(result instanceof Error) {
        return res.status(StatusCodes.NOT_FOUND).json({
            errors: {
                default: result.message
            }
        });
    }

    return res.status(StatusCodes.OK).json(result);

}