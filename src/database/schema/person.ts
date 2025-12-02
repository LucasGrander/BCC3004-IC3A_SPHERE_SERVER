import { pgEnum, pgTable, serial, text} from "drizzle-orm/pg-core";
import { eq, relations } from "drizzle-orm";
import { party } from "./party";
import { service } from "./service";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { db } from "..";

export const personRoles = [
    "Fornecedor",
    "Organizador"
] as const;

export const roles = pgEnum('person_role', personRoles);

export const person = pgTable("person", {

    id: serial().primaryKey().notNull(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    phone: text('phone'),
    role: roles().notNull(),

});

export const personRelations = relations(person, ({ many }) => ({

    party: many(party),
    service: many(service)

}));

export const bodyCreateSchema = createInsertSchema(person)
    .extend({
        name: z.string().min(5,'Nome muito curto!'),
        email: z.email('Email não inserido ou formado invalido').min(5,'Email muito curto!').max(30,'Email muito grande!'),
        password: z.string().min(5,"Senha muita curta!").max(50, 'Senha muito longa!'),
        phone: z.string().min(9,'Numero muito curto!').max(15,'Numero muito longo!').optional().default('Não Informado'),
        role: z.enum(personRoles,'Cargo invalido!')
    });

export const bodySignInSchema = z.object(person)
    .pick({
        email:true,
        password:true
    })
    .extend({
        email: z.email('Email não inserido ou formado invalido').min(5,'Email muito curto!').max(30,'Email muito grande!'),
        password: z.string().min(5,"Senha muita curta!").max(50, 'Senha muito longa!')
    });

export const selectPersonSchema = createSelectSchema(person);

export const paramsSchema = z.object({
    id: z.coerce.number().int().positive()
});


export type NewPerson = z.infer<typeof bodyCreateSchema>;

export type SignIn = z.infer<typeof bodySignInSchema>;

export type SelectPerson = z.infer<typeof selectPersonSchema>;

export type Params = z.infer<typeof paramsSchema>;


export const createPerson = async (newPerson: NewPerson): Promise<SelectPerson|Error> =>{
    try {
        const result = await db
            .insert(person)
            .values(newPerson)
            .returning({
                id: person.id,
                name: person.name,
                email: person.email,
                password: person.password,
                phone: person.phone,
                role: person.role
            });

            const createdPerson = result[0];

            if (!createdPerson){
                return new Error('Erro ao inserir registro no banco.');
            }

            return createdPerson;

    } catch (e: any) {
        console.log("Erro no createPerson: ",e);

        const error = e.cause || e;

        if (error.code === '23505'){
            if(error.constraint === 'person_email_unique'){
                return new Error('Esse email ja esta cadastrado!');
            }
            if(error.constraint === 'person_pkey'){
                return new Error('Esse id ja existe!');
            }
        }
        if(e instanceof Error){
            return e;
        }
        return new Error('Erro desconhecido ao criar o registro');
    }
}

export const getPersonById = async (id: number): Promise<SelectPerson | Error> => {
    try {
        const result = await db
        .select()
        .from(person).where(eq(person.id, id));

        const foundPerson = result[0];

        if (!foundPerson) {
            return new Error('Pessoa não encontrada');
        }

        return foundPerson;

    } catch (e: any){

        console.log("Erro no getPersonById", e);

        if (e instanceof Error){
            return e;
        }

        return new Error('Erro desconhecido ao buscar pessoa');
    }
}

export const getPersonByEmail = async (email: string): Promise<SelectPerson | Error> =>{

    try {
        const result = await db
        .select()
        .from(person).where(eq(person.email, email));

        const foundPerson = result[0];

        if (!foundPerson){
            return new Error('Pessoa não encontrada');
        }
        
        return foundPerson;
    } catch (e: any) {
        console.log("Erro no getPersonByEmail:", e);

        if (e instanceof Error) {
            return e;
     }

     return new Error('Erro desconhecido ao buscar pessoa');

    }

}

export const deletePersonById = async (id: number): Promise<void | Error> => {
    
    try{

        const cnt = await db.$count(person, eq(person.id, id));

        if (cnt === 0) {
            return new Error('Pessoa não encontrada');
        }

        const result = await db
            .delete(person)
            .where(eq(person.id, id))
            .returning ({
                deletedId: party.id
            });

        if (result) return;

        return new Error('Erro ao deletar registro');

    } catch (e: any) {

        console.log('Erro no deletePersonById: ', e );

        if(e instanceof Error){
            return e;
        }

        return new Error('Erro desconhecido ao deletar uma pessoa');
    }
}