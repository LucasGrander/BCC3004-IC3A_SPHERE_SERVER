import { StatusCodes } from "http-status-codes";
import { testServer } from "../jest.setup";
import { deletePersonById } from "../../src/database/schema/person";


describe('Service - UpdateById', () => {

    const email = 'uServiceTests@mail.com';
    const pass = 'S2nH41';
    const id = 22;
    let accessToken = '';

    const email1 = 'gServiceTas@mail.com';
    const pass1 = 'S2nH41';
    const id1 = 218;
    let accessToken1 = '';

    beforeAll(async () => {

        const createAcc = await testServer
            .post('/signup')
            .send({

                id: id,
                name: 'updateTest',
                email: email,
                password: pass,
                role: 'fornecedor'
            })

        const logAcc = await testServer
            .post('/signin')
            .send({
                email: email,
                password: pass
            })

        accessToken = logAcc.body.token;

        const Service = await testServer
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

            
        const createAcc1 = await testServer
            .post('/signup')
            .send({

                id: id1,
                name: 'getByIdTest',
                email: email1,
                password: pass1,
                role: 'fornecedor'
            })

        const logAcc1 = await testServer
            .post('/signin')
            .send({
                email: email1,
                password: pass1
            })

        accessToken1 = logAcc1.body.token;

        const Service1 = await testServer
            .post('/service')
            .set({ authorization: `Bearer ${accessToken1}` })
            .send({
                id: id1,
                name: "Teste00",
                description: "Doces do T00",
                type: "Buffet",
                price: "10.99",
                person_id: id1
            });

    })


    afterAll(async () => {

        const deleteAcc = await deletePersonById(id)
        const deleteAcc1 = await deletePersonById(id1)

    })

    it('T00 - Tenta atualizar um serviço', async () => {

        const test00 = await testServer
            .put(`/service/${id}`)
            .set({ authorization: `Bearer ${accessToken}` })
            .send({
                name: "Teste00",
                description: "Buffet do T00",
                type: "Buffet",
                price: "11.99",
            });

        expect(test00.statusCode).toEqual(StatusCodes.NO_CONTENT);
        expect(typeof test00.body).toEqual('object')


    });

    it('T01 - Tenta atualizar um serviço colocando campos curtos', async () => {

        const test01 = await testServer
            .put(`/service/${id}`)
            .set({ authorization: `Bearer ${accessToken}` })
            .send({

                name: "T00",
                description: "BuffetT00",
                type: "Buffet",
                price: "",

            });


        expect(test01.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(test01.body).toHaveProperty('errors.body.name');
        expect(test01.body).toHaveProperty('errors.body.description');
        expect(test01.body).toHaveProperty('errors.body.price');

    });

    it('T02 - Tenta atualizar um serviço colocando campos longos', async () => {

        const test02 = await testServer
            .put(`/service/${id}`)
            .set({ authorization: `Bearer ${accessToken}` })
            .send({
                name: "TesteTesteTesteTesteTesteTeste",
                description: "TesteTesteTesteTesteTesteTesteTesteTesteTesteTeste",
                type: "Infra",
                price: "2.75",
            });


        expect(test02.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(test02.body).toHaveProperty('errors.body.name');
        expect(test02.body).toHaveProperty('errors.body.description');

    });

    it('T03 - Tenta atualizar um serviço colocando um preço com centavos sem casas 2 decimais', async () => {

        const test03 = await testServer
            .put(`/service/${id}`)
            .set({ authorization: `Bearer ${accessToken}` })
            .send({
                name: "Balões do T03",
                description: "Balões de todas as cores e tamanhos",
                type: "Entreterimento",
                price: "3.1",
            }); 
        
        expect(test03.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(test03.body).toHaveProperty('errors.body.price');

    });

    it('T04 - Tenta atualizar um serviço colocando categoria inválida', async () => {

        const test04 = await testServer
            .put(`/service/${id}`)
            .set({ authorization: `Bearer ${accessToken}` })
            .send({
                name: "Balões do T04",
                description: "Balões de todas as cores e tamanhos",
                type: "Balões",
                price: "4.50",
            }); 
        
        expect(test04.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(test04.body).toHaveProperty('errors.body.type');

    });

    it('T05 - Tenta atualizar um serviço inexistente', async () => {

        const test05 = await testServer
            .put('/service/2019')
            .set({ authorization: `Bearer ${accessToken}` })
            .send({
                name: "Balões do T04",
                description: "Balões de todas as cores e tamanhos",
                type: "Entreterimento",
                price: "4.50",
            }); 


        expect(test05.statusCode).toEqual(StatusCodes.NOT_FOUND);
        expect(test05.body).toHaveProperty('errors.default');


    });

    it('T06 - Tenta atualizar um serviço que não pertence ao usuário', async () => {

        const test06 = await testServer
            .put(`/service/${id1}`)
            .set({ authorization: `Bearer ${accessToken}` })
            .send({
                name: "Balões do T04",
                description: "Balões de todas as cores e tamanhos",
                type: "Entreterimento",
                price: "4.50",
            }); 


        expect(test06.statusCode).toEqual(StatusCodes.FORBIDDEN);
        expect(test06.body).toHaveProperty('errors.default');


    });

    it('T07 - Tenta atualizar um serviço enquanto não autenticado', async () => {

        const test07 = await testServer
            .put(`/service/${id}`)
            .send({
                name: "Balões do T04",
                description: "Balões de todas as cores e tamanhos",
                type: "Entreterimento",
                price: "4.50",
            }); 


        expect(test07.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
        expect(test07.body).toHaveProperty('errors.default');


    });
});
