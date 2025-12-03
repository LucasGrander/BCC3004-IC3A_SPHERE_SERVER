import { StatusCodes } from "http-status-codes";
import { testServer } from "../jest.setup";
import { deletePersonById } from "../../src/database/schema/person";


describe('Party - UpdateById', () => {

    const email = 'uPartyTests@mail.com';
    const pass = 'S2nH41';
    const PersId = 222262;
    let PartId = '';
    let accessToken = '';

    beforeAll(async () => {

        const createAcc = await testServer
            .post('/signup')
            .send({

                id: PersId,
                name: 'createTest',
                email: email,
                password: pass,
                role: 'Organizador'
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
                name: "Teste00",
                date: "2030-12-31T13:13",
                street: "Rua T00",
                number: "N T00",
                complement: "Mercado T00",
                neighborhood: "Gueto T00",
                city: "T00wn",
                type: "formatura",
                person_id: PersId

            });

        PartId = Party.body.id;

    })


    afterAll(async () => {
        const deleteCreation = await testServer
            .delete(`/party/${PartId}`)
            .set({ authorization: `Bearer ${accessToken}` });

        const deleteAcc = await deletePersonById(PersId)
    })

    it('T00 - Tenta atualizar uma festa', async () => {

        const test00 = await testServer
            .put(`/party/${PartId}`)
            .set({ authorization: `Bearer ${accessToken}` })
            .send({
                name: "Teste_00 ",
                date: "2040-12-31T13:13",
                street: "Av T00",
                number: "N X1T00",
                complement: "Mercearia T00",
                neighborhood: "Jardim T00",
                city: "T00nstale",
                type: "formatura",
            });

        expect(test00.statusCode).toEqual(StatusCodes.NO_CONTENT);
        expect(typeof test00.body).toEqual('object')


    });

    it('T01 - Tenta atualizar uma festa colocando campos curtos', async () => {

        const test01 = await testServer
            .put(`/party/${PartId}`)
            .set({ authorization: `Bearer ${accessToken}` })
            .send({
                name: "T01",
                date: "2030-12-31T13:13",
                street: "Rua",
                number: "",
                complement: "T01",
                neighborhood: "T01",
                city: "T01",
                type: "formatura",

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
            .put(`/party/${PartId}`)
            .set({ authorization: `Bearer ${accessToken}` })
            .send({
                name: "Teste02",
                date: "2030-14-56T32:99",
                street: "Rua T02",
                number: "T02",
                complement: "Perto do T01",
                neighborhood: "Gueto dos testes",
                city: "Testelândia",
                type: "formatura",
            });


        expect(test02.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(test02.body).toHaveProperty('errors.body.date');


    });

    it('T03 - Tenta atualizar uma festa colocando formato de data inválido', async () => { // Válido (YYYY-MM-DDTHH:MM)

        const test03 = await testServer
            .put(`/party/${PartId}`)
            .set({ authorization: `Bearer ${accessToken}` })
            .send({
                name: "Teste03",
                date: "2030/14/56 - 07:00",
                street: "Rua T03",
                number: "T03",
                complement: "Perto do T02",
                neighborhood: "Gueto dos testes",
                city: "Testelândia",
                type: "formatura",

            });


        expect(test03.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(test03.body).toHaveProperty('errors.body.date');


    });

    it('T04 - Tenta atualizar uma festa colocando uma categoria inválida', async () => {

        const test04 = await testServer
            .put(`/party/${PartId}`)
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
            .put('/party/999999')
            .set({ authorization: `Bearer ${accessToken}` })
            .send({
                name: "Teste05",
                date: "2050-12-30T07:00",
                street: "Rua T05",
                number: "T05",
                complement: "Perto do T04",
                neighborhood: "Gueto dos testes",
                city: "Testelândia",
                type: "formatura",

            });


        expect(test05.statusCode).toEqual(StatusCodes.NOT_FOUND);
        expect(test05.body).toHaveProperty('errors.default');


    });

    it('T06 - Tenta atualizar uma festa que não pertence ao usuário', async () => {

        const test06 = await testServer
            .put('/party/143')
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
            .put(`/party/${PartId}`)
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
