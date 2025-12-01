import { StatusCodes } from "http-status-codes";
import { testServer } from "../jest.setup";


describe('Party - Create', () => {

    afterAll( async() => {
        const deleteCreation = await testServer
            .delete('/party/1');
    })

    it('T00 - Tenta criar uma festa', async () => {

        const test00 = await testServer
            .post('/party')
            .send({
                id: 1,
                name: "Teste00",
                date: "2030-12-31T13:13",
                street: "Rua T00",
                number: "N T00",
                complement: "Mercado T00",
                neighborhood: "Gueto T00",
                city: "T00wn",
                type: "formatura",
                person_id: 1

            });


        expect(test00.statusCode).toEqual(StatusCodes.CREATED);
        expect(typeof test00.body).toEqual('object');
        
    });

    it('T01 - Tenta criar uma festa com campos curtos', async () => {

        const test01 = await testServer
            .post('/party')
            .send({
                name: "T01",
                date: "2030-12-31T13:13",
                street: "Rua",
                number: "",
                complement: "T01",
                neighborhood: "T01",
                city: "T01",
                type: "formatura",
                person_id: 1

            });


        expect(test01.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(test01.body).toHaveProperty('errors.body.name');
        expect(test01.body).toHaveProperty('errors.body.street');
        expect(test01.body).toHaveProperty('errors.body.number');
        expect(test01.body).toHaveProperty('errors.body.complement');
        expect(test01.body).toHaveProperty('errors.body.neighborhood');
        expect(test01.body).toHaveProperty('errors.body.city');

    });

    it('T02 - Tenta criar uma festa com data inválida', async () => {

        const test02 = await testServer
            .post('/party')
            .send({
                name: "Teste02",
                date: "2030-14-56T32:99",
                street: "Rua T02",
                number: "T02",
                complement: "Perto do T01",
                neighborhood: "Gueto dos testes",
                city: "Testelândia",
                type: "formatura",
                person_id: 1

            });


        expect(test02.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(test02.body).toHaveProperty('errors.body.date');
    

    });

    it('T03 - Tenta criar uma festa com formato de data inválido', async () => { // Válido (YYYY-MM-DDTHH:MM)

        const test03 = await testServer
            .post('/party')
            .send({
                name: "Teste03",
                date: "2030/14/56 - 07:00",
                street: "Rua T03",
                number: "T03",
                complement: "Perto do T02",
                neighborhood: "Gueto dos testes",
                city: "Testelândia",
                type: "formatura",
                person_id: 1

            });


        expect(test03.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(test03.body).toHaveProperty('errors.body.date');
    

    });

    it('T04 - Tenta criar uma festa com categoria inválida', async () => {

        const test04 = await testServer
            .post('/party')
            .send({
                name: "Teste04",
                date: "2040-14-56T07:00",
                street: "Rua T04",
                number: "T04",
                complement: "Perto do T03",
                neighborhood: "Gueto dos testes",
                city: "Testelândia",
                type: "Rolê",
                person_id: 1

            });


        expect(test04.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(test04.body).toHaveProperty('errors.body.type');
    

    });

    it('T05 - Tenta criar uma festa com id já existente', async () => {

        const test05 = await testServer
            .post('/party')
            .send({
                id: 1,
                name: "Teste05",
                date: "2030-12-31T13:13",
                street: "Rua T05",
                number: "N T05",
                complement: "Perto do T04",
                neighborhood: "Gueto dos testes",
                city: "Testelândia",
                type: "formatura",
                person_id: 1

            });


        expect(test05.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(test05.body).toHaveProperty('errors.default');
        
    });

    it('T06 - Tenta criar uma festa com id de pessoa inexistente', async () => {

        const test06 = await testServer
            .post('/party')
            .send({
                name: "Teste06",
                date: "2030-12-31T13:13",
                street: "Rua T06",
                number: "N T06",
                complement: "Perto do T05",
                neighborhood: "Gueto dos testes",
                city: "Testelândia",
                type: "formatura",
                person_id: 9999

            });


        expect(test06.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(test06.body).toHaveProperty('errors.default');
        
    });
});
