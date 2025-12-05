import * as create from "./Create";
import * as getAllPServices from "./GetAllPartyServ";
import * as getAllFContracts from "./GetAllContract";
import * as updateById from "./UpdateById";

export const ContractController = {
    ...create,
    ...updateById,
    ...getAllPServices,
    ...getAllFContracts

};