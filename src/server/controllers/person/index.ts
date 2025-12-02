import * as signUp from "./SignUp";
import * as getById from "./GetById";
import * as deleteById from "./DeleteById";
import * as signIn from "./SignIn";

export const PersonController = {
    ...signUp,
    ...getById,
    ...deleteById,
    ...signIn
};