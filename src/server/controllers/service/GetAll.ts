import { type Request, type RequestHandler, type Response } from "express";
import { getAllPersonServiceById, querySchema } from "../../../database/schema/service";
import { StatusCodes } from "http-status-codes";
import { validate } from "../../shared/middleware";

export const getAllValidator: RequestHandler = validate({ query: querySchema });

export const getAll = async (req: Request, res: Response) => {

    if (req.headers.personRole !== 'Fornecedor') {
            return res.status(StatusCodes.FORBIDDEN).json({
                errors: {
                    default: "Função apenas para Fornecedores."
                }
            });
        }

    const id = Number(req.headers.personId);

    const { page, limit, filter } = req.validatedQuery;

    const result = await getAllPersonServiceById(id, page, limit, filter);

    if(result instanceof Error) {
        return res.status(StatusCodes.NOT_FOUND).json({
            errors: {
                default: result.message
            }
        });
    }

    return res.status(StatusCodes.OK).json(result);

}