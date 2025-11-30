import * as signUp from "./SignUp";
import * as getById from "./GetById";
import * as deleteById from "./DeleteById";

export const PersonController = {
    ...signUp,
    ...getById,
    ...deleteById
};