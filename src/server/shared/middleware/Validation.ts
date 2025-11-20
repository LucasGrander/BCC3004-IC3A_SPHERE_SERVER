import { z } from "zod"
import { type Request, type Response, type NextFunction } from "express"

const flattenZodError = (zErr: z.ZodError) => Object.fromEntries(zErr.issues.map(i => [i.path.join("."), i.message]))

type Schemas = {
  body?: z.ZodTypeAny
  params?: z.ZodTypeAny
  query?: z.ZodTypeAny
  headers?: z.ZodTypeAny
}

export const validate = (schemas: Schemas) =>
  (req: Request, res: Response, next: NextFunction) => {

    const errors: Record<string, Record<string, string>> = {}

    if (schemas.params) {
      const result = schemas.params.safeParse(req.params)
      if (!result.success) {
        errors.params = flattenZodError(result.error)
      } else {
        req.validatedParams = result.data 
      }
    }

    if (schemas.query) {
      const result = schemas.query.safeParse(req.query)
      if (!result.success) {
        errors.query = flattenZodError(result.error)
      } else {
        req.validatedQuery = result.data
      }
    }

    if (schemas.headers) {
      const result = schemas.headers.safeParse(req.headers)
      if (!result.success) {
        errors.headers = flattenZodError(result.error)
      } else {
        req.validatedHeaders = result.data 
      }
    }

    if (schemas.body) {
      const result = schemas.body.safeParse(req.body)
      if (!result.success) {
        errors.body = flattenZodError(result.error)
      } else {
        req.validatedBody = result.data
      }
    }

    // se houver QUALQUER erro → 400
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors })
    }

    return next()
  }