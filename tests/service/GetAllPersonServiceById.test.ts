import { StatusCodes } from "http-status-codes";
import { testServer } from "../jest.setup";
import { deletePersonById } from "../../src/database/schema/person";


describe('Service - GetAllPersonServiceById', () => {

    const email = 'gServiceTests@mail.com';
    const pass = 'S2nH41';
    const id = 22262;
    let accessToken = '';

    beforeAll(async () => {

        const createAcc = await testServer
            .post('/signup')
            .send({

                id: id,
                name: 'getAllTest',
                email: email,
                password: pass,
                role: 'Fornecedor'
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

    })


    afterAll(async () => {

        const deleteAcc = await deletePersonById(id)
        
    })


    it('T00 - Tenta buscar todos os serviços de uma pessoa', async () => {

        const test00 = await testServer
            .get('/service/all')
            .set({ authorization: `Bearer ${accessToken}` });


        expect(test00.statusCode).toEqual(StatusCodes.OK);
        expect(typeof test00.body).toBe('object');
        expect(test00.body).toHaveLength(1);


    });

    it('T01 - Tenta buscar todos os serviços de uma pessoa passando string por parâmetro', async () => {

        const test01 = await testServer
            .get('/service/all/teste')
            .set({ authorization: `Bearer ${accessToken}` });


        expect(test01.statusCode).toEqual(StatusCodes.NOT_FOUND);

    });

    it('T02 - Tenta buscar todos os serviços de uma pessoa passando parâmetros', async () => {

        const test02 = await testServer
            .get('/service/all/2')
            .set({ authorization: `Bearer ${accessToken}` });


        expect(test02.statusCode).toEqual(StatusCodes.NOT_FOUND);

    });

    it('T03 - Tenta buscar todos os serviços de uma pessoa, passando queries válidas', async () => {

        const test03 = await testServer
            .get('/service/all?page=1&limit=1&filter=T')
            .set({ authorization: `Bearer ${accessToken}` });


        expect(test03.statusCode).toEqual(StatusCodes.OK);
        expect(typeof test03.body).toBe('object');


    });

    it('T04 - Tenta buscar todos os serviços de uma pessoa, passando queries inválidas', async () => {

        const test04 = await testServer
            .get('/service/all?pages=1&limite=1&filters=T')
            .set({ authorization: `Bearer ${accessToken}` });


        expect(test04.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(test04.body).toHaveProperty('errors.query');


    });

    it('T05 - Tenta buscar todos os serviços de uma pessoa enquanto não autenticado', async () => {

        const test05 = await testServer
            .get('/service/all');


        expect(test05.statusCode).toEqual(StatusCodes.UNAUTHORIZED);

    });


});
