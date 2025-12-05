import { type Request, type Response } from "express";
import { getAllContracts } from "../../../database/schema/partyService";
import { StatusCodes } from "http-status-codes";

export const getAllContract = async (req: Request, res: Response) => {

    if (req.headers.personRole !== 'fornecedor') {
        return res.status(StatusCodes.FORBIDDEN).json({
            errors: {
                default: "Função apenas para Fornecedores."
            }
        });
    }

    const result = await getAllContracts(Number(req.headers.personId));

    if (result instanceof Error) {
        return res.status(StatusCodes.NOT_FOUND).json({
            errors: {
                default: result.message
            }
        });
    }

    return res.status(StatusCodes.OK).json(result);

}