import Express  from 'express';
import cors  from 'cors';
import compression from 'compression';
import http from 'http';
import bodyParser from 'body-parser';
import { router } from './routes';

// import cors from 'cors';
// import cookieParser from 'cookie-parser';

const app = Express();

// app.use(cors({ credentials: true }));
// app.use(cookieParser());

app.use(cors());
app.use(compression());
app.use(bodyParser.json());
app.use('/', router)

app.use(Express.json());

const server = http.createServer(app);

export { server };