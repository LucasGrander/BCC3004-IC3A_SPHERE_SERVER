import type { Request, Response } from "express";
import { getFornecer, getOrganizer, paramsSchema, updateContractStatus } from "../../../database/schema/partyService";
import { StatusCodes } from "http-status-codes";
import { validate } from "../../shared/middleware";
import { notificationSubject } from "../../../events/NotificationSubject";

export const cancelValidator = validate({ params: paramsSchema })

export const cancelContract = async (req: Request, res: Response) => {

    let verifyOwnr;

    if (req.headers.personRole !== 'organizador') {
        return res.status(StatusCodes.FORBIDDEN).json({
            errors: {
                default: "Função apenas para organizadores."
            }
        });
    }

    verifyOwnr = await getOrganizer(req.validatedParams.id);

    if (verifyOwnr instanceof Error) {

        return res.status(StatusCodes.NOT_FOUND).json({
            errors: {
                default: verifyOwnr.message
            }
        });

    } else if (req.headers.personId !== verifyOwnr.organizerId.toString()) {

        return res.status(StatusCodes.FORBIDDEN).json({
            errors: {
                default: "Você só pode cancelar seus contratos."
            }
        });

    }

    const result = await updateContractStatus(req.validatedParams.id, "Cancelado");

    if (result instanceof Error) {

        if (result.cause === "CONTRACT_IS_DONE") {
            return res.status(StatusCodes.NOT_ACCEPTABLE).json({
                errors: {
                    default: result.message + ", não é possível cancelá-lo."
                }
            });
        }

        return res.status(StatusCodes.NOT_FOUND).json({
            errors: {
                default: result.message
            }
        });

    }


    verifyOwnr = await getFornecer(req.validatedParams.id)

    if (verifyOwnr instanceof Error) {

        return res.status(StatusCodes.NOT_FOUND).json({
            errors: {
                default: verifyOwnr.message
            }
        });

    }

    notificationSubject.emit("contract:Cancel", {
        personId: verifyOwnr.fornecerId, // id do fornecedor do servico         
        contractId: Number(req.validatedParams.id),
    })

    return res.status(StatusCodes.NO_CONTENT).json(`O Contrato ${result.contractId} Cancelado.`);

}

