import { StatusCodes } from "http-status-codes";
import { testServer } from "../jest.setup";
import { deletePersonById } from "../../src/database/schema/person";


describe('Service - GetById', () => {

    const email = 'gServiceTestes@mail.com';
    const pass = 'S2nH41';
    const id = 3262;
    let accessToken = '';

    const email1 = 'gServiceTas@mail.com';
    const pass1 = 'S2nH41';
    const id1 = 232;
    let accessToken1 = '';

    beforeAll(async () => {

        const createAcc = await testServer
            .post('/signup')
            .send({

                id: id,
                name: 'getByIdTest',
                email: email,
                password: pass,
                role: 'fornecedor'
            })

        const logAcc = await testServer
            .post('/signin')
            .send({
                email: email,
                password: pass
            })

        accessToken = logAcc.body.token;

        const Service = await testServer
            .post('/service')
            .set({ authorization: `Bearer ${accessToken}` })
            .send({
                id: id,
                name: "Teste00",
                description: "Doces do T00",
                type: "Buffet",
                price: "10.99",
                person_id: id
            });

        const createAcc1 = await testServer
            .post('/signup')
            .send({

                id: id1,
                name: 'getByIdTest',
                email: email1,
                password: pass1,
                role: 'fornecedor'
            })

        const logAcc1 = await testServer
            .post('/signin')
            .send({
                email: email1,
                password: pass1
            })

        accessToken1 = logAcc1.body.token;

        const Service1 = await testServer
            .post('/service')
            .set({ authorization: `Bearer ${accessToken1}` })
            .send({
                id: id1,
                name: "Teste00",
                description: "Doces do T00",
                type: "Buffet",
                price: "10.99",
                person_id: id1
            });

    })

    afterAll(async () => {

        const deleteAcc = await deletePersonById(id)
        const deleteAcc1 = await deletePersonById(id1)
    })
    

    it('T00 - Tenta buscar um serviço por id', async () => {

        const test00 = await testServer
            .get(`/service/${id}`)
            .set({ authorization: `Bearer ${accessToken}` })

        expect(test00.statusCode).toEqual(StatusCodes.OK);
        expect(typeof test00.body).toEqual('object')


    });

    it('T01 - Tenta buscar um serviço com id inexistente', async () => {

        const test01 = await testServer
            .get(`/service/9123`)
            .set({ authorization: `Bearer ${accessToken}` })


        expect(test01.statusCode).toEqual(StatusCodes.NOT_FOUND);
        expect(test01.body).toHaveProperty('errors.default');

    });

    it('T02 - Tenta buscar um serviço, passando uma string como parâmetro', async () => {

        const test02 = await testServer
            .get('/service/teste')
            .set({ authorization: `Bearer ${accessToken}` })


        expect(test02.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(test02.body).toHaveProperty('errors.params.id');

    });

    it('T03 - Tenta buscar um serviço, sem passar parâmetro', async () => {

        const test03 = await testServer
            .get('/service/')
            .set({ authorization: `Bearer ${accessToken}` })


        expect(test03.statusCode).toEqual(StatusCodes.NOT_FOUND);

    });

    it('T04 - Tenta buscar um serviço de outro organizador', async () => {

        const test04 = await testServer
            .get(`/service/${id1}`)
            .set({ authorization: `Bearer ${accessToken}` })


        expect(test04.statusCode).toEqual(StatusCodes.FORBIDDEN);
        expect(test04.body).toHaveProperty('errors.default')

    });


});
