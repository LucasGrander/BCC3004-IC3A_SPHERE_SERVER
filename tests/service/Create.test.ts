import { StatusCodes } from "http-status-codes";
import { testServer } from "../jest.setup";
import { deletePersonById } from "../../src/database/schema/person";


describe('Service - Create', () => {

    const email = 'cServiceTests@mail.com';
    const pass = 'S2nH41';
    const id = 300;
    let accessToken = '';

    beforeAll( async() => {

        const createAcc = await testServer
            .post('/signup')
            .send({ 

                id: id,
                name: 'createTest',
                email: email,
                password: pass,
                role: 'Fornecedor'
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

        const deleteAcc = deletePersonById(id); // Como o relacionamento de person com service (e com party) é cascade, ao deletar a conta do banco, seus serviços (e festas) são deletados também.

    })

    it('T00 - Tenta criar um serviço', async () => {

        const test00 = await testServer
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

        expect(test00.statusCode).toEqual(StatusCodes.CREATED);
        expect(typeof test00.body).toEqual('object');

        
    });

    it('T01 - Tenta criar um serviço com campos curtos', async () => {

        const test01 = await testServer
            .post('/service')
            .set({ authorization: `Bearer ${accessToken}` })
            .send({
                name: "T01",
                description: "T01",
                type: "Infra",
                price: "",
                person_id: id
            });


        expect(test01.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(test01.body).toHaveProperty('errors.body.name');
        expect(test01.body).toHaveProperty('errors.body.description');
        expect(test01.body).toHaveProperty('errors.body.price');


    });


    it('T02 - Tenta criar um serviço com campos longos', async () => {

        const test02 = await testServer
            .post('/service')
            .set({ authorization: `Bearer ${accessToken}` })
            .send({
                name: "TesteTesteTesteTesteTesteTeste",
                description: "TesteTesteTesteTesteTesteTesteTesteTesteTesteTeste",
                type: "Infra",
                price: "2.75",
                person_id: id
            });


        expect(test02.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(test02.body).toHaveProperty('errors.body.name');
        expect(test02.body).toHaveProperty('errors.body.description');

    });

    it('T03 - Tenta criar um serviço com preço com centavos sem casas 2 decimais', async () => {

        const test03 = await testServer
            .post('/service')
            .set({ authorization: `Bearer ${accessToken}` })
            .send({
                name: "Balões do T03",
                description: "Balões de todas as cores e tamanhos",
                type: "Entreterimento",
                price: "3.1",
                person_id: id
            }); 
        
            console.log(test03.body)

        expect(test03.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(test03.body).toHaveProperty('errors.body.price');

    });

    it('T04 - Tenta criar um serviço com categoria inválida', async () => {

        const test04 = await testServer
            .post('/service')
            .set({ authorization: `Bearer ${accessToken}` })
            .send({
                name: "Balões do T04",
                description: "Balões de todas as cores e tamanhos",
                type: "Balões",
                price: "4.50",
                person_id: id
            }); 
        
        expect(test04.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(test04.body).toHaveProperty('errors.body.type');

    });

    it('T05 - Tenta criar um serviço com id já existente', async () => {

        const test05 = await testServer
            .post('/service')
            .set({ authorization: `Bearer ${accessToken}` })
            .send({
                id: id,
                name: "Balões do T05",
                description: "Balões de todas as cores e tamanhos",
                type: "Entreterimento",
                price: "4.50",
                person_id: id
            }); 
        

        expect(test05.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(test05.body).toHaveProperty('errors.default');

    });

    it('T06 - Tenta criar um serviço sem estar autenticado', async () => {

        const test06 = await testServer
            .post('/service')
            .send({
                name: "Balões do T06",
                description: "Balões de todas as cores e tamanhos",
                type: "Entreterimento",
                price: "4.60",
                person_id: id
            }); 

        expect(test06.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
        expect(test06.body).toHaveProperty('errors.default');

    });

});
