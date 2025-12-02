import { type Request, type RequestHandler, type Response } from "express";
import { bodySignInSchema, getPersonByEmail, type SignIn } from "../../../database/schema/person";
import { StatusCodes } from "http-status-codes";
import { validate } from "../../shared/middleware/Validation";
import { JWTService, PasswordCrypto } from "../../shared/services";

export const signInValidator: RequestHandler = validate({ body: bodySignInSchema });

export const signIn = async (req: Request<{}, {}, SignIn>, res: Response) => {

    const { email, password } = req.validatedBody;

    const person = await getPersonByEmail(email);

    if (person instanceof Error) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            errors: {
                default: 'Email ou senha são inválidos'
            }
        });
    }

    const passwordMatch = await PasswordCrypto.verifyPassword(password, person.password);

    if (!passwordMatch) {

        return res.status(StatusCodes.UNAUTHORIZED).json({
            errors: {
                default: 'Email ou senha são inválidos'
            }
        });

    } else {

        const accessToken = JWTService.signT({ uid: person.id, role: person.role });

        if (accessToken === 'JWT_SECRET_NOT_FOUND') {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                errors: {
                    default: 'Erro ao gerar o token de acesso'
                }
            });
        }

        return res.status(StatusCodes.OK).json({ 

            id: person.id,
            role: person.role,
            token: accessToken

         });
    }

}