import 'dotenv/config';
import { server } from "./server/Server.js";

const PORT = (process.env.PORT);

server.listen(PORT, () => {
    console.log(`Server rodando na porta ${PORT}.`)   
});





