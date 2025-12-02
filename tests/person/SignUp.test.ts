import { StatusCodes } from "http-status-codes"
import { testServer } from "../jest.setup"

describe('Person - SignUp', () => {

    const email = 'Teste00@mail.com';
    const id = 2;
    
    afterAll( async() => {
        const deleteCreation = await testServer
            .delete(`/person/${id}`);
    })
    
    it('T00 - Tenta cadastrar uma pessoa', async() => {

        const test00 = await testServer
            .post('/signup')
            .send({ 
                id: id,
                name: 'Teste00',
                email: email,
                password: 'S2nH41',
                phone: '(99)9999-99999',
                role: 'Organizador'
            })

        expect(test00.statusCode).toEqual(StatusCodes.CREATED);
        expect(typeof test00.body).toEqual('object');

    })

    it('T01 - Tenta cadastrar uma pessoa com campos curtos', async() => {

        const test01 = await testServer
            .post('/signup')
            .send({ 
                name: 'T01',
                email: 'T@m.c',
                password: 'S2',
                phone: '(99)999',
                role: 'Organizador'
            })

        expect(test01.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(test01.body).toHaveProperty('errors.body.name');
        expect(test01.body).toHaveProperty('errors.body.email');
        expect(test01.body).toHaveProperty('errors.body.password');
        expect(test01.body).toHaveProperty('errors.body.phone');

    })

    it('T02 - Tenta cadastrar uma pessoa com campos muito longos', async() => {

        const test02 = await testServer
            .post('/signup')
            .send({ 
                name: 'Teste02',
                email: 'TesteTesteTesteTesteTesteTeste@mail.com',
                password: 'S2nH4S2nH4S2nH4S2nH4S2nH4S2nH4S2nH4S2nH4S2nH4S2nH41',
                phone: '(99)9999-999999999999999',
                role: 'Organizador'
            })

        expect(test02.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(test02.body).toHaveProperty('errors.body.email');
        expect(test02.body).toHaveProperty('errors.body.password');
        expect(test02.body).toHaveProperty('errors.body.phone');

    })

    it('T03 - Tenta cadastrar uma pessoa com cargo inválido', async() => {

        const test03 = await testServer
            .post('/signup')
            .send({ 
                name: 'Teste02',
                email: 'Teste02@mail.com',
                password: 'S2nH41',
                phone: '(99)9999-99999',
                role: 'Rolezeiro'
            })

        expect(test03.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(test03.body).toHaveProperty('errors.body.role');

    })

    it('T04 - Tenta cadastrar uma pessoa com id já existente', async() => {

        const test04 = await testServer
            .post('/signup')
            .send({ 
                id: id,
                name: 'Teste04',
                email: 'Teste04@mail.com',
                password: 'S2nH41',
                phone: '(99)9999-99999',
                role: 'Organizador'
            })

        expect(test04.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
        expect(test04.body).toHaveProperty('errors.default');

    })

    it('T05 - Tenta cadastrar uma pessoa com email já existente', async() => {

        const test04 = await testServer
            .post('/signup')
            .send({ 
                name: 'Teste04',
                email: email,
                password: 'S2nH41',
                phone: '(99)9999-99999',
                role: 'Organizador'
            })

        expect(test04.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
        expect(test04.body).toHaveProperty('errors.default');

    })
})
