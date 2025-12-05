import { StatusCodes } from "http-status-codes";
import { testServer } from "../jest.setup";
import { deletePersonById } from "../../src/database/schema/person";


describe('Party - GetById', () => {

    const email = 'gIdPartyTests@mail.com';
    const pass = 'S2nH41';
    const Id = 21232;
    let accessToken = '';

    const email2 = 'gIdPrtyTest@mail.com';
    const pass2 = 'S2nH41';
    const Id2 = 279;

    let accessToken2 = '';

    beforeAll(async () => {

        const createAcc = await testServer
            .post('/signup')
            .send({

                id: Id,
                name: 'getIdTest',
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


        const createAcc2 = await testServer
            .post('/signup')
            .send({

                id: Id2,
                name: 'TestDel',
                email: email2,
                password: pass2,
                role: 'organizador'
            })

        const logAcc2 = await testServer
            .post('/signin')
            .send({
                email: email2,
                password: pass2
            })

        accessToken2 = logAcc2.body.token;

        const Party2 = await testServer
            .post('/party')
            .set({ authorization: `Bearer ${accessToken2}` })
            .send({
                id: Id2,
                name: "Teste00",
                date: "2030-12-31T13:13",
                street: "Rua T00",
                number: "N T00",
                complement: "Mercado T00",
                neighborhood: "Gueto T00",
                city: "T00wn",
                type: "Formatura",
                person_id: Id2

            });

    })


    afterAll(async () => {

        const deleteAcc = await deletePersonById(Id)
        const deleteAcc2 = await deletePersonById(Id2)

    })

    it('T00 - Tenta buscar uma festa por id', async () => {

        const test00 = await testServer
            .get(`/party/${Id}`)
            .set({ authorization: `Bearer ${accessToken}` })
            .send();

        expect(test00.statusCode).toEqual(StatusCodes.OK);
        expect(typeof test00.body).toEqual('object')


    });

    it('T01 - Tenta buscar uma festa com id inexistente', async () => {

        const test01 = await testServer
            .get('/party/999')
            .set({ authorization: `Bearer ${accessToken}` })
            .send();


        expect(test01.statusCode).toEqual(StatusCodes.NOT_FOUND);
        expect(test01.body).toHaveProperty('errors.default');


    });

    it('T02 - Tenta buscar uma festa, passando uma string como parâmetro', async () => {

        const test02 = await testServer
            .get('/party/teste')
            .set({ authorization: `Bearer ${accessToken}` })
            .send();


        expect(test02.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(test02.body).toHaveProperty('errors.params.id');


    });

    it('T03 - Tenta buscar uma festa, sem passar parâmetro', async () => {

        const test03 = await testServer
            .get('/party/')
            .set({ authorization: `Bearer ${accessToken}` })
            .send();


        expect(test03.statusCode).toEqual(StatusCodes.NOT_FOUND);

    });

    it('T04 - Tenta buscar festa de outro organizador', async () => {

        const test04 = await testServer
            .get(`/party/${Id2}`)
            .set({ authorization: `Bearer ${accessToken}` })
            .send();


        expect(test04.statusCode).toEqual(StatusCodes.FORBIDDEN);
        expect(test04.body).toHaveProperty('errors.default')

    });


});
