import { StatusCodes } from "http-status-codes";
import { testServer } from "../jest.setup";


describe('Party - GetById', () => {

    beforeAll( async() => {
        const partyCreation = await testServer
            .post('/party')
            .send({
                id: 20,
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
            .delete('/party/20');
    })

    it('T00 - Tenta buscar uma festa por id', async () => {

        const test00 = await testServer
            .get('/party/20') 
            .send();

        expect(test00.statusCode).toEqual(StatusCodes.OK);
        expect(typeof test00.body).toEqual('object')
    
        
    });

    it('T01 - Tenta buscar uma festa com id inexistente', async () => {

        const test01 = await testServer
            .get('/party/999')
            .send();


        expect(test01.statusCode).toEqual(StatusCodes.NOT_FOUND);
        expect(test01.body).toHaveProperty('errors.default');
        

    });

    it('T02 - Tenta buscar uma festa, passando uma string como parâmetro', async () => {

        const test02 = await testServer
            .get('/party/teste')
            .send();


        expect(test02.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(test02.body).toHaveProperty('errors.params.id');
    

    });

    it('T03 - Tenta buscar uma festa, sem passar parâmetro', async () => {

        const test03 = await testServer
            .get('/party/')
            .send();


        expect(test03.statusCode).toEqual(StatusCodes.NOT_FOUND);

    });


});
