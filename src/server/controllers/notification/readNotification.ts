import type { Request, RequestHandler, Response } from "express";
import { validate } from "../../shared/middleware";
import { bodyUpdateSchema, getFornecer, paramsSchema, readNotificationById, type UpdatedNotification } from "../../../database/schema/notification";
import { StatusCodes } from "http-status-codes";
import { toLowerCase } from "zod";


export const readByIdValidator: RequestHandler = validate({ params: paramsSchema, body: bodyUpdateSchema })

export const readNotification = async (req: Request<{}, {}, UpdatedNotification>, res: Response) => {

    if (req.headers.personRole !== 'fornecedor') {
        return res.status(StatusCodes.FORBIDDEN).json({
            errors: {
                default: "Função apenas para Fornecedores."
            }
        });
    }

    const verifyOwnr = await getFornecer(req.validatedParams.id)

    if (verifyOwnr instanceof Error) {

        return res.status(StatusCodes.NOT_FOUND).json({
            errors: {
                default: verifyOwnr.message
            }
        });

    } else if (req.headers.personId !== verifyOwnr.fornecerId.toString()) {

        return res.status(StatusCodes.FORBIDDEN).json({
            errors: {
                default: "Você só pode ler suas notificações."
            }
        });

    }

    const result = await readNotificationById(req.validatedParams.id)

    if (result instanceof Error) {
        return res.status(StatusCodes.NOT_FOUND).json({
            errors: {
                default: result.message
            }
        });
    }

    return res.status(StatusCodes.OK).json(result);
}
