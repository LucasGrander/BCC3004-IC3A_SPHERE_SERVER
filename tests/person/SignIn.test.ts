import { StatusCodes } from "http-status-codes"
import { testServer } from "../jest.setup"
import { deletePersonById } from "../../src/database/schema/person";

describe('Person - SignIn', () => {

    const email = 'signInTest@mail.com';
    const pass = 'S2nH41';
    const id = 20;

    beforeAll( async() => {

        const createAcc = await testServer
            .post('/signup')
            .send({ 
                id: id,
                name: 'signInTest',
                email: email,
                password: pass,
                role: 'organizador'
            })
 
    })

    afterAll( async() => {

        const deleteAcc = await deletePersonById(id);

    })

    it('T00 - Tenta entrar em uma conta (existente)', async() => {

        const test00 = await testServer
            .post('/signin')
            .send({ 
                email: email,
                password: pass
            })


        expect(test00.statusCode).toEqual(StatusCodes.OK);
        expect(test00.body).toHaveProperty('token');
        expect(test00.body).toHaveProperty('id');
        expect(test00.body).toHaveProperty('role');

    })

    it('T01 - Tenta entrar em uma conta inexistente', async() => {

        const test01 = await testServer
            .post('/signin')
            .send({ 
                email: 'signIn@mainModule.com',
                password: pass
            })


        expect(test01.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
        expect(test01.body).toHaveProperty('errors.default');

    })

    it('T02 - Tenta entrar com senha inválida', async() => {

        const test02 = await testServer
            .post('/signin')
            .send({ 
                email: email,
                password: 'euachoqueéestasenha'
            })


        expect(test02.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
        expect(test02.body).toHaveProperty('errors.default');

    })

    it('T03 - Tenta entrar sem passar email', async() => {

        const test03 = await testServer
            .post('/signin')
            .send({ 
                password: pass
            })


        expect(test03.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(test03.body).toHaveProperty('errors.body.email');

    })

    it('T04 - Tenta entrar sem passar senha', async() => {

        const test04 = await testServer
            .post('/signin')
            .send({ 
                email: email
            })


        expect(test04.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(test04.body).toHaveProperty('errors.body.password');

    })
    
})