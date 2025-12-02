import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { PartyController, PersonController } from "../controllers";
import { ensureAuthenticated } from "../shared/middleware";


const router = Router();

router.get('/', (_, res) =>{
    
    return res.status(StatusCodes.IM_A_TEAPOT).send('Olá Yuri');
});

router.post('/party', PartyController.createValidator, PartyController.create);
router.put('/party/:id', PartyController.updateByIdValidator, PartyController.updateById);
router.get('/party/all/:id', PartyController.getAllValidator, PartyController.getAll);
router.get('/party/:id', PartyController.getByIdValidator, PartyController.getById);
router.delete('/party/:id', PartyController.deleteByIdValidator, PartyController.deleteById);

router.post('/signup', PersonController.signUpValidator, PersonController.signUp);
router.post('/signin', PersonController.signInValidator, PersonController.signIn);
// router.get('/person/:id', PersonController.getByIdValidator, PersonController.getById);
// router.delete('/person/:id', PersonController.deleteByIdValidator, PersonController.deleteById);


export { router };