import { StatusCodes } from "http-status-codes";
import { testServer } from "../jest.setup";
import { deletePersonById } from "../../src/database/schema/person";


describe('Party - GetAllPersonPartyById', () => {

    const email = 'gPrtyTests@mail.com';
    const pass = 'S2nH41';
    const Id = 2262;
    let accessToken = '';

    beforeAll(async () => {

        const createAcc = await testServer
            .post('/signup')
            .send({

                id: Id,
                name: 'getAllTest',
                email: email,
                password: pass,
                role: 'organizador'
            })

        const logAcc = await testServer
            .post('/signin')
            .send({
                email: email,
                password: pass
            })

        accessToken = logAcc.body.token;

        const Party = await testServer
            .post('/party')
            .set({ authorization: `Bearer ${accessToken}` })
            .send({
                id: Id,
                name: "Teste00",
                date: "2030-12-31T13:13",
                street: "Rua T00",
                number: "N T00",
                complement: "Mercado T00",
                neighborhood: "Gueto T00",
                city: "T00wn",
                type: "Formatura",
                person_id: Id

            });

    })

    afterAll(async () => {

        const deleteAcc = await deletePersonById(Id)

    })



    it('T00 - Tenta buscar todas as festas de uma pessoa', async () => {

        const test00 = await testServer
            .get('/party/all')
            .set({ authorization: `Bearer ${accessToken}` });


        expect(test00.statusCode).toEqual(StatusCodes.OK);
        expect(typeof test00.body).toBe('object');
        expect([test00.body]).toHaveLength(1);


    });

    // it('T01 - Tenta buscar todas as festas de uma pessoa inexistente', async () => {

    //     const test01 = await testServer
    //         .get('/party/all/999');


    //     expect(test01.statusCode).toEqual(StatusCodes.NOT_FOUND);
    //     expect(test01.body).toHaveProperty('errors.default');


    // });

    it('T01 - Tenta buscar todas as festas de uma pessoa passando string por parâmetro', async () => {

        const test01 = await testServer
            .get('/party/all/teste')
            .set({ authorization: `Bearer ${accessToken}` });


        expect(test01.statusCode).toEqual(StatusCodes.NOT_FOUND);

    });

    it('T02 - Tenta buscar todas as festas de uma pessoa passando parâmetros', async () => {

        const test02 = await testServer
            .get('/party/all/2')
            .set({ authorization: `Bearer ${accessToken}` });


        expect(test02.statusCode).toEqual(StatusCodes.NOT_FOUND);

    });

    it('T03 - Tenta buscar todas as festas de uma pessoa, passando queries válidas', async () => {

        const test03 = await testServer
            .get('/party/all?page=1&limit=1&filter=T')
            .set({ authorization: `Bearer ${accessToken}` });


        expect(test03.statusCode).toEqual(StatusCodes.OK);
        expect(typeof test03.body).toBe('object');


    });

    it('T04 - Tenta buscar todas as festas de uma pessoa, passando queries inválidas', async () => {

        const test04 = await testServer
            .get('/party/all?pages=1&limite=1&filters=T')
            .set({ authorization: `Bearer ${accessToken}` });


        expect(test04.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(test04.body).toHaveProperty('errors.query');


    });


});
