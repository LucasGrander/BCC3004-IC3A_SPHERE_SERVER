import { StatusCodes } from "http-status-codes";
import { testServer } from "../jest.setup";
import { deletePersonById } from "../../src/database/schema/person";
import { id } from "zod/locales";


describe('Service - DeleteById', () => {

    const email = 'dServiceTest@mail.com';
    const pass = 'S2nH41';
    const id = 771;
    let accessToken = '';

    const email2 = 'dServiTests@mail.com';
    const pass2 = 'S2nH41';
    const id2 = 291;
    let accessToken2 = '';

    beforeAll(async () => {

        const createAcc1 = await testServer
            .post('/signup')
            .send({

                id: id,
                name: 'TestDel',
                email: email,
                password: pass,
                role: 'Fornecedor'
            })

        const logAcc1 = await testServer
            .post('/signin')
            .send({
                email: email,
                password: pass
            })

        accessToken = logAcc1.body.token;

        const Serv = await testServer
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

        const createAcc2 = await testServer
            .post('/signup')
            .send({

                id: id2,
                name: 'TestDel',
                email: email2,
                password: pass2,
                role: 'Fornecedor'

            })

        const logAcc2 = await testServer
            .post('/signin')
            .send({
                email: email2,
                password: pass2
            })

        accessToken2 = logAcc2.body.token;

        const Serv2 = await testServer
            .post('/service')
            .set({ authorization: `Bearer ${accessToken2}` })
            .send({
                id: id2,
                name: "Teste00",
                description: "Doces do T00",
                type: "Buffet",
                price: "10.99",
                person_id: id2
            });


    });

    afterAll(async () => {

        const deleteAcc1 = await deletePersonById(id);

        const deleteAcc2 = await deletePersonById(id2);

    })

    it('T00 - Tenta deletar uma serviço', async () => {

        const test00 = await testServer
            .delete(`/service/${id}`)
            .set({ authorization: `Bearer ${accessToken}` });

        expect(test00.statusCode).toEqual(StatusCodes.NO_CONTENT);
        expect(test00.body).toEqual({})


    });

    it('T01 - Tenta deletar uma serviço inexistente', async () => {

        const test01 = await testServer
            .delete('/service/99999')
            .set({ authorization: `Bearer ${accessToken}` });


        expect(test01.statusCode).toEqual(StatusCodes.NOT_FOUND);
        expect(test01.body).toHaveProperty('errors.default');


    });

    it('T02 - Tenta deletar um serviço, sem passar parâmetro', async () => {

        const test02 = await testServer
            .delete('/service/')
            .set({ authorization: `Bearer ${accessToken}` });


        expect(test02.statusCode).toEqual(StatusCodes.NOT_FOUND);

    });


    it('T03 - Tenta deletar um serviço que não pertence ao usuário', async () => {

        const test03 = await testServer
            .delete(`/service/${id2}`)
            .set({ authorization: `Bearer ${accessToken}` })


        expect(test03.statusCode).toEqual(StatusCodes.FORBIDDEN);
        expect(test03.body).toHaveProperty('errors.default');


    });

    it('T04 - Tenta deletar uma festa sem passar token', async () => {

        const test04 = await testServer
            .delete(`/party/${id}`);


        expect(test04.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
        expect(test04.body).toHaveProperty('errors.default');


    });
});
