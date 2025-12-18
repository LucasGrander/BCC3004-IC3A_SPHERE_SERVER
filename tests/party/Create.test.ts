import { StatusCodes } from "http-status-codes";
import { testServer } from "../jest.setup";
import { deletePersonById } from "../../src/database/schema/person";


describe('Party - Create', () => {

    const email = 'cPartyTests@mail.com';
    const pass = 'S2nH41';
    const id = 222;
    let accessToken = '';

    beforeAll( async() => {

        const createAcc = await testServer
            .post('/signup')
            .send({ 

                id: id,
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

    })


    afterAll( async() => {
        const deleteCreation = await testServer
            .delete('/party/1')
            .set({ authorization: `Bearer ${accessToken}`});

        const deleteAcc = await deletePersonById(id)
    })

    it('T00 - Tenta criar uma festa', async () => {

        const test00 = await testServer
            .post('/party')
            .set({ authorization: `Bearer ${accessToken}` })
            .send({
                id: 1,
                name: "Teste00",
                date: "2030-12-31T13:13",
                street: "Rua T00",
                number: "N T00",
                complement: "Mercado T00",
                neighborhood: "Gueto T00",
                city: "T00wn",
                type: "Formatura",
                person_id: id

            });


        expect(test00.statusCode).toEqual(StatusCodes.CREATED);
        expect(typeof test00.body).toEqual('object');

        console.log(test00.statusCode);
        
    });

    it('T01 - Tenta criar uma festa com campos curtos', async () => {

        const test01 = await testServer
            .post('/party')
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
                person_id: id
            });


        expect(test01.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(test01.body).toHaveProperty('errors.body.name');
        expect(test01.body).toHaveProperty('errors.body.street');
        expect(test01.body).toHaveProperty('errors.body.number');
        expect(test01.body).toHaveProperty('errors.body.neighborhood');
        expect(test01.body).toHaveProperty('errors.body.city');

    });

    it('T02 - Tenta criar uma festa com data inválida', async () => {

        const test02 = await testServer
            .post('/party')
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
                person_id: id

            });


        expect(test02.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(test02.body).toHaveProperty('errors.body.date');
    

    });

    it('T03 - Tenta criar uma festa com formato de data inválido', async () => { // Válido (YYYY-MM-DDTHH:MM)

        const test03 = await testServer
            .post('/party')
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
                person_id: id

            });


        expect(test03.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(test03.body).toHaveProperty('errors.body.date');
    

    });

    it('T04 - Tenta criar uma festa com categoria inválida', async () => {

        const test04 = await testServer
            .post('/party')
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
                person_id: id

            });


        expect(test04.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(test04.body).toHaveProperty('errors.body.type');
    

    });

    it('T05 - Tenta criar uma festa com id já existente', async () => {

        const test05 = await testServer
            .post('/party')
            .set({ authorization: `Bearer ${accessToken}` })
            .send({
                id: 1,
                name: "Teste05",
                date: "2030-12-31T13:13",
                street: "Rua T05",
                number: "N T05",
                complement: "Perto do T04",
                neighborhood: "Gueto dos testes",
                city: "Testelândia",
                type: "Formatura",
                person_id: id

            });


        expect(test05.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(test05.body).toHaveProperty('errors.default');
        
    });
});
