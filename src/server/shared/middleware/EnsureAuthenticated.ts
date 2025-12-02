import type { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { JWTService } from "../services";


export const ensureAuthenticated: RequestHandler = async (req, res, next) => {

    const { authorization } = req.headers
    console.log(req.headers);

    if (!authorization) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            errors: { default: "Não Autenticado" }
        })
    }

    const [type, token] = authorization.split(' '); 

    if (type !== 'Bearer' || !token) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            errors: { default: "Não Autenticado" }
        })
    }

    const jwtData = JWTService.verifyT(token);

    if (jwtData === 'JWT_SECRET_NOT_FOUND') {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: { default: "Erro ao verificar o token" }
        })
    }else if (jwtData === 'INVALID_TOKEN') {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            errors: { default: "Não Autenticado" }
        })
    }

    console.log(jwtData);

    req.headers.personId = jwtData.uid.toString();
    req.headers.personRole = jwtData.role.toString();

    return next();

}