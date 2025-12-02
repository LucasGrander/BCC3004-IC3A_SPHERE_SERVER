import { StatusCodes } from "http-status-codes";
import { testServer } from "../jest.setup";


describe('Party - DeleteById', () => {

    beforeAll( async() => {
        const party0Creation = await testServer
            .post('/party')
            .send({
                id: 40,
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

    it('T00 - Tenta deletar uma festa', async () => {

        const test00 = await testServer
            .delete('/party/40');

        expect(test00.statusCode).toEqual(StatusCodes.NO_CONTENT);
        expect(test00.body).toEqual({})
    
        
    });

    it('T01 - Tenta deletar uma festa inexistente', async () => {

        const test01 = await testServer
            .delete('/party/999');


        expect(test01.statusCode).toEqual(StatusCodes.NOT_FOUND);
        expect(test01.body).toHaveProperty('errors.default');
        

    });

    it('T02 - Tenta atualizar uma festa, sem passar parâmetro', async () => {

        const test02 = await testServer
            .delete('/party/');


        expect(test02.statusCode).toEqual(StatusCodes.NOT_FOUND);

    });


    // it('T05 - Tenta deletar uma festa que não pertence ao usuário', async () => {

    //     const test05 = await testServer
    //         .post('/party')
    //         .send({
    //             name: "Teste05",
    //             date: "2050-15-56T07:00",
    //             street: "Rua T05",
    //             number: "T05",
    //             complement: "Perto do T04",
    //             neighborhood: "Gueto dos testes",
    //             city: "Testelândia",
    //             type: "Rolê",
    //             person_id: 1

    //         });


    //     expect(test05.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    //     expect(test05.body).toHaveProperty('errors.body.type');
    

    // });
});
