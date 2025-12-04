import { StatusCodes } from "http-status-codes";
import { testServer } from "../jest.setup";
import { deletePersonById } from "../../src/database/schema/person";


describe('Party - UpdateById', () => {

    const email = 'uPartyTests@mail.com';
    const pass = 'S2nH41';
    const Id = 2652;
    let accessToken = '';

    const email2 = 'gIdPrst@mail.com';
    const pass2 = 'S2nH41';
    const Id2 = 2010;
    let accessToken2 = '';


    beforeAll(async () => {

        const createAcc = await testServer
            .post('/signup')
            .send({

                id: Id,
                name: 'createTest',
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

    it('T00 - Tenta atualizar uma festa', async () => {

        const test00 = await testServer
            .put(`/party/${Id}`)
            .set({ authorization: `Bearer ${accessToken}` })
            .send({
                name: "Teste_00 ",
                date: "2040-12-31T13:13",
                street: "Av T00",
                number: "N X1T00",
                complement: "Mercearia T00",
                neighborhood: "Jardim T00",
                city: "T00nstale",
                type: "Formatura",
            });

        expect(test00.statusCode).toEqual(StatusCodes.NO_CONTENT);
        expect(typeof test00.body).toEqual('object')


    });

    it('T01 - Tenta atualizar uma festa colocando campos curtos', async () => {

        const test01 = await testServer
            .put(`/party/${Id}`)
            .set({ authorization: `Bearer ${accessToken}` })
            .send({
                name: "T01",
                date: "2030-12-31T13:13",
                street: "Rua",
                number: "",
                complement: "T01",
                neighborhood: "T01",
                city: "T01",
                type: "Formatura",

            });


        expect(test01.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(test01.body).toHaveProperty('errors.body.name');
        expect(test01.body).toHaveProperty('errors.body.street');
        expect(test01.body).toHaveProperty('errors.body.number');
        expect(test01.body).toHaveProperty('errors.body.complement');
        expect(test01.body).toHaveProperty('errors.body.neighborhood');
        expect(test01.body).toHaveProperty('errors.body.city');

    });

    it('T02 - Tenta atualizar uma festa colocando una data inválida', async () => {

        const test02 = await testServer
            .put(`/party/${Id}`)
            .set({ authorization: `Bearer ${accessToken}` })
            .send({
                name: "Teste02",
                date: "2030-14-56T32:99",
                street: "Rua T02",
                number: "T02",
                complement: "Perto do T01",
                neighborhood: "Gueto dos testes",
                city: "Testelândia",
                type: "Formatura",
            });


        expect(test02.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(test02.body).toHaveProperty('errors.body.date');


    });

    it('T03 - Tenta atualizar uma festa colocando formato de data inválido', async () => { // Válido (YYYY-MM-DDTHH:MM)

        const test03 = await testServer
            .put(`/party/${Id}`)
            .set({ authorization: `Bearer ${accessToken}` })
            .send({
                name: "Teste03",
                date: "2030/14/56 - 07:00",
                street: "Rua T03",
                number: "T03",
                complement: "Perto do T02",
                neighborhood: "Gueto dos testes",
                city: "Testelândia",
                type: "Formatura",

            });


        expect(test03.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(test03.body).toHaveProperty('errors.body.date');


    });

    it('T04 - Tenta atualizar uma festa colocando uma categoria inválida', async () => {

        const test04 = await testServer
            .put(`/party/${Id}`)
            .set({ authorization: `Bearer ${accessToken}` })
            .send({
                name: "Teste04",
                date: "2040-14-56T07:00",
                street: "Rua T04",
                number: "T04",
                complement: "Perto do T03",
                neighborhood: "Gueto dos testes",
                city: "Testelândia",
                type: "Rolê",

            });


        expect(test04.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(test04.body).toHaveProperty('errors.body.type');


    });

    it('T05 - Tenta atualizar uma festa inexistente', async () => {

        const test05 = await testServer
            .put('/party/1229')
            .set({ authorization: `Bearer ${accessToken}` })
            .send({
                name: "Teste05",
                date: "2050-12-30T07:00",
                street: "Rua T05",
                number: "T05",
                complement: "Perto do T04",
                neighborhood: "Gueto dos testes",
                city: "Testelândia",
                type: "Formatura",

            });


        expect(test05.statusCode).toEqual(StatusCodes.NOT_FOUND);
        expect(test05.body).toHaveProperty('errors.default');


    });

    it('T06 - Tenta atualizar uma festa que não pertence ao usuário', async () => {

        const test06 = await testServer
            .put(`/party/${Id2}`)
            .set({ authorization: `Bearer ${accessToken}` })
            .send({
                name: "Teste06",
                date: "2060-12-26T07:00",
                street: "Rua T06",
                number: "T06",
                complement: "Perto do T05",
                neighborhood: "Gueto dos testes",
                city: "Testelândia",

            });


        expect(test06.statusCode).toEqual(StatusCodes.FORBIDDEN);
        expect(test06.body).toHaveProperty('errors.default');


    });

    it('T07 - Tenta atualizar uma festa enquanto não autenticado', async () => {

        const test07 = await testServer
            .put(`/party/${Id}`)
            .send({
                name: "Teste07",
                date: "2060-12-26T07:00",
                street: "Rua T07",
                number: "T07",
                complement: "Perto do T06",
                neighborhood: "Gueto dos testes",
                city: "Testelândia",

            });


        expect(test07.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
        expect(test07.body).toHaveProperty('errors.default');


    });
});
