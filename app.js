import express from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Rota inicial!");
});

app.get("/usuarios", (req, res) => {
  res.send("Rota usuário");
});

console.log("Banco conectado:", process.env.DB_NAME);

app.listen(port, () => {
  console.log(
    `Servidor rodando na porta: ${port} - Acesse: http://localhost:3000/`
  );
});
