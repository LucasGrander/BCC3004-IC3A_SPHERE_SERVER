import * as create from "./Create";
import * as getAllPServices from "./GetAllPartyServ";
import * as getAllFContracts from "./GetAllContract";
import * as updateById from "./UpdateById";
import * as cancelContract from "./Cancel";
import * as finishContract from "./Finish";

export const ContractController = {
    ...create,
    ...cancelContract,
    ...finishContract,
    ...updateById,
    ...getAllPServices,
    ...getAllFContracts


};