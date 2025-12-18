import type { Request, Response } from "express";
import { getFornecer, paramsSchema, updateContractStatus } from "../../../database/schema/partyService";
import { StatusCodes } from "http-status-codes";
import { validate } from "../../shared/middleware";

export const finishValidator = validate({ params: paramsSchema })

export const finishContract = async (req: Request, res: Response) => {

    let verifyOwnr;

    if (req.headers.personRole !== 'fornecedor') {
        return res.status(StatusCodes.FORBIDDEN).json({
            errors: {
                default: "Função apenas para Fornecedores."
            }
        });
    }

    verifyOwnr = await getFornecer(req.validatedParams.id);

    if (verifyOwnr instanceof Error) {

        return res.status(StatusCodes.NOT_FOUND).json({
            errors: {
                default: verifyOwnr.message
            }
        });

    } else if (req.headers.personId !== verifyOwnr.fornecerId.toString()) {

        return res.status(StatusCodes.FORBIDDEN).json({
            errors: {
                default: "Você só pode finalizar seus contratos."
            }
        });

    }

    const result = await updateContractStatus(req.validatedParams.id, "Finalizado");

    if (result instanceof Error) {

        if (result.cause === "CONTRACT_IS_DONE") {
            return res.status(StatusCodes.NOT_ACCEPTABLE).json({
                errors: {
                    default: result.message + ", bom trabalho!"
                }
            });
        }

        return res.status(StatusCodes.NOT_FOUND).json({
            errors: {
                default: result.message 
            }
        });

    }

    return res.status(StatusCodes.NO_CONTENT).json(`O Contrato ${result.contractId} Finalizado.`);

}

