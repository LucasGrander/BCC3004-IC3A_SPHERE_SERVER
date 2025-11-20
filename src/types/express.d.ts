import { z } from "zod";

declare global {
  namespace Express {
    interface Request {
      validatedBody?: any;
      validatedQuery?: any;
      validatedParams?: any;
      validatedHeaders?: any;
    }
  }
}