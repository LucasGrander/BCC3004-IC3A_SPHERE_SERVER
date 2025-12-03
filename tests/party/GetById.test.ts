import { StatusCodes } from "http-status-codes";
import { testServer } from "../jest.setup";
import { deletePersonById } from "../../src/database/schema/person";


describe('Party - GetById', () => {

    const email = 'gPartyTests@mail.com';
        const pass = 'S2nH41';
        const PersId = 21232;
        let PartId= '';
        let accessToken = '';
    
        beforeAll( async() => {
    
            const createAcc = await testServer
                .post('/signup')
                .send({ 
    
                    id: PersId,
                    name: 'getIdTest',
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
    
    
        afterAll( async() => {
            const deleteCreation = await testServer
                .delete(`/party/${PartId}` )
                .set({ authorization: `Bearer ${accessToken}`});
    
            const deleteAcc = await deletePersonById(PersId)
        })

    it('T00 - Tenta buscar uma festa por id', async () => {

        const test00 = await testServer
            .get(`/party/${PartId}`)
            .set({ authorization: `Bearer ${accessToken}`}) 
            .send();

        expect(test00.statusCode).toEqual(StatusCodes.OK);
        expect(typeof test00.body).toEqual('object')
    
        
    });

    it('T01 - Tenta buscar uma festa com id inexistente', async () => {

        const test01 = await testServer
            .get('/party/99999')
            .set({ authorization: `Bearer ${accessToken}`}) 
            .send();


        expect(test01.statusCode).toEqual(StatusCodes.NOT_FOUND);
        expect(test01.body).toHaveProperty('errors.default');
        

    });

    it('T02 - Tenta buscar uma festa, passando uma string como parâmetro', async () => {

        const test02 = await testServer
            .get('/party/teste')
            .set({ authorization: `Bearer ${accessToken}`})
            .send();


        expect(test02.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(test02.body).toHaveProperty('errors.params.id');
    

    });

    it('T03 - Tenta buscar uma festa, sem passar parâmetro', async () => {

        const test03 = await testServer
            .get('/party/')
            .set({ authorization: `Bearer ${accessToken}`})
            .send();


        expect(test03.statusCode).toEqual(StatusCodes.NOT_FOUND);

    });

    it('T04 - Tenta buscar festa de outro organizador', async () => {

        const test04 = await testServer
            .get('/party/143')
            .set({ authorization: `Bearer ${accessToken}`})
            .send();


        expect(test04.statusCode).toEqual(StatusCodes.FORBIDDEN);
        expect(test04.body).toHaveProperty('errors.default')

    });


});
