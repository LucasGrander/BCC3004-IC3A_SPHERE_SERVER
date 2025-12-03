import { StatusCodes } from "http-status-codes";
import { testServer } from "../jest.setup";
import { deletePersonById } from "../../src/database/schema/person";


describe('Party - DeleteById', () => {

    const email = 'dPartyTests@mail.com';
    const pass = 'S2nH41';
    const PersId = 333;
    const PartId = 331;
    let accessToken = '';

    const email2 = 'dPrtyTest@mail.com';
    const pass2 = 'S2nH41';
    const PersId2 = 223;
    const PartId2 = 311;
    let accessToken2 = '';

    beforeAll(async () => {

        const createAcc1 = await testServer
            .post('/signup')
            .send({

                id: PersId,
                name: 'TestDel',
                email: email,
                password: pass,
                role: 'Organizador'
            })

        const logAcc1 = await testServer
            .post('/signin')
            .send({
                email: email,
                password: pass
            })

        accessToken = logAcc1.body.token;

        const Party = await testServer
            .post('/party')
            .set({ authorization: `Bearer ${accessToken}` })
            .send({
                id: PartId,
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

        const createAcc2 = await testServer
            .post('/signup')
            .send({

                id: PersId2,
                name: 'TestDel',
                email: email2,
                password: pass2,
                role: 'Organizador'
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
                id: PartId2,
                name: "Teste00",
                date: "2030-12-31T13:13",
                street: "Rua T00",
                number: "N T00",
                complement: "Mercado T00",
                neighborhood: "Gueto T00",
                city: "T00wn",
                type: "formatura",
                person_id: PersId2

            });


    })


    afterAll(async () => {

        const deleteParty2 = await testServer
            .delete(`/party/${PartId2}`)
            .set({ authorization: `Bearer ${accessToken2}` });

        const deleteAcc1 = await deletePersonById(PersId);

        const deleteAcc2 = await deletePersonById(PersId2);

    })

    it('T00 - Tenta deletar uma festa', async () => {

        const test00 = await testServer
            .delete(`/party/${PartId}`)
            .set({ authorization: `Bearer ${accessToken}` });

        expect(test00.statusCode).toEqual(StatusCodes.NO_CONTENT);
        expect(test00.body).toEqual({})


    });

    it('T01 - Tenta deletar uma festa inexistente', async () => {

        const test01 = await testServer
            .delete('/party/99999')
            .set({ authorization: `Bearer ${accessToken}` });


        expect(test01.statusCode).toEqual(StatusCodes.NOT_FOUND);
        expect(test01.body).toHaveProperty('errors.default');


    });

    it('T02 - Tenta atualizar uma festa, sem passar parâmetro', async () => {

        const test02 = await testServer
            .delete('/party/')
            .set({ authorization: `Bearer ${accessToken}` });


        expect(test02.statusCode).toEqual(StatusCodes.NOT_FOUND);

    });


    it('T03 - Tenta deletar uma festa que não pertence ao usuário', async () => {

        const test03 = await testServer
            .delete(`/party/${PartId2}`)
            .set({ authorization: `Bearer ${accessToken}` })


        expect(test03.statusCode).toEqual(StatusCodes.FORBIDDEN);
        expect(test03.body).toHaveProperty('errors.default');


    });

    it('T04 - Tenta deletar uma festa sem passar token', async () => {

        const test04 = await testServer
            .delete(`/party/${PartId}`);


        expect(test04.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
        expect(test04.body).toHaveProperty('errors.default');


    });
});
