import Express  from 'express';
import cors  from 'cors';
import compression from 'compression';
import http from 'http';
import bodyParser from 'body-parser';
import { router } from './routes';
import "../observers/InAppNotificationObserver";

const app = Express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(cors());
app.use(compression());
app.use(bodyParser.json());
app.use('/', router)

app.use(Express.json());

const server = http.createServer(app);

export { server };