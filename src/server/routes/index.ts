import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { ContractController, PartyController, PersonController, ServiceController } from "../controllers";
import { ensureAuthenticated } from "../shared/middleware";


const router = Router();

router.get('/', (_, res) =>{
    
    return res.status(StatusCodes.IM_A_TEAPOT).send('Olá Yuri');
});

router.post('/party', ensureAuthenticated, PartyController.createValidator, PartyController.create);
router.put('/party/:id', ensureAuthenticated, PartyController.updateByIdValidator, PartyController.updateById);
router.get('/party/all', ensureAuthenticated, PartyController.getAllValidator, PartyController.getAll);
router.get('/party/:id', ensureAuthenticated, PartyController.getByIdValidator, PartyController.getById);
router.delete('/party/:id', ensureAuthenticated, PartyController.deleteByIdValidator, PartyController.deleteById);

router.post('/service', ensureAuthenticated, ServiceController.createValidator, ServiceController.create);
router.put('/service/:id', ensureAuthenticated, ServiceController.updateByIdValidator, ServiceController.updateById);
router.get('/service/all', ensureAuthenticated, ServiceController.getAllValidator, ServiceController.getAll);
router.get('/service/:id', ensureAuthenticated, ServiceController.getByIdValidator, ServiceController.getById);
router.delete('/service/:id', ensureAuthenticated, ServiceController.deleteByIdValidator, ServiceController.deleteById);

router.post('/contract', ensureAuthenticated, ContractController.createValidator, ContractController.create);
router.put('/contract/:id', ensureAuthenticated, ContractController.updateByIdValidator, ContractController.updateById);
router.get('/party/contracts/:id', ensureAuthenticated, ContractController.getAllValidator, ContractController.getAllPartyServ);
router.get('/contracts', ensureAuthenticated, ContractController.getAllContract);


router.post('/signup', PersonController.signUpValidator, PersonController.signUp);
router.post('/signin', PersonController.signInValidator, PersonController.signIn);
// router.get('/person/:id', PersonController.getByIdValidator, PersonController.getById);
router.delete('/person/:id', PersonController.deleteByIdValidator, PersonController.deleteById);


export { router };