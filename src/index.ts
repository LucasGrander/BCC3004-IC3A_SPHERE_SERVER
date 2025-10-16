import express, { type NextFunction, type Request, type Response } from "express";
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import usersRouter from "./routes/users";

const app = express();

const PORT = (process.env.PORT);

const db = drizzle(process.env.DATABASE_URL!);

app.use('/api/users', usersRouter);

app.listen(PORT, () => {
    console.log(` Running on Port ${PORT} `)
});



