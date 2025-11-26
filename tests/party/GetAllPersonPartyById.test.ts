import { StatusCodes } from "http-status-codes";
import { testServer } from "../jest.setup";


describe('Party - GetAllPersonPartyById', () => {

    beforeAll( async() => {
        const partyCreation = await testServer
            .post('/party')
            .send({
                id: 30,
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
    })

    afterAll( async() => {
        const deleteCreation = await testServer
            .delete('/party/30');
    })



    it('T00 - Tenta buscar todas as festas de uma pessoa', async () => {

        const test00 = await testServer
            .get('/party/all/1');


        expect(test00.statusCode).toEqual(StatusCodes.OK);
        expect(typeof test00.body).toBe('object');
        expect([test00.body]).toHaveLength(1);
    

    });

    it('T01 - Tenta buscar todas as festas de uma pessoa inexistente', async () => { 

        const test01 = await testServer
            .get('/party/all/999');


        expect(test01.statusCode).toEqual(StatusCodes.NOT_FOUND);
        expect(test01.body).toHaveProperty('errors.default');
    

    });

    it('T02 - Tenta buscar todas as festas de uma pessoa passando string por parâmetro', async () => {

        const test02 = await testServer
            .get('/party/all/teste')
            .send();


        expect(test02.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(test02.body).toHaveProperty('errors.params.id');
    

    });

    it('T03 - Tenta buscar todas as festas de uma pessoa, sem passar parâmetros', async () => {

        const test03 = await testServer
            .get('/party/all/');


        expect(test03.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(test03.body).toHaveProperty('errors.params.id');
    

    });

    it('T04 - Tenta buscar todas as festas de uma pessoa, passando queries válidas', async () => {

        const test04 = await testServer
            .get('/party/all/1?page=1&limit=1&filter=T');


        expect(test04.statusCode).toEqual(StatusCodes.OK);
        expect(typeof test04.body).toBe('object');
    

    });

    it('T05 - Tenta buscar todas as festas de uma pessoa, passando queries inválidas', async () => {

        const test05 = await testServer
            .get('/party/all/1?pages=1&limite=1&filters=T');


        expect(test05.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(test05.body).toHaveProperty('errors.query');
    

    });


});
