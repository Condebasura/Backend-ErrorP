import express from 'express';
import cors from 'cors';
import path, {win32} from 'path';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import {fileURLToPath} from 'url';
import http from 'http';
import { Server } from 'socket.io';
import session from 'express-session';
import secControllers from './controllers/SecControllers.js';

dotenv.config();

const app = express();

const _dirname = (process.platform === 'win32')? fileURLToPath(new URL(".", import.meta.url)): path.dirname(new URL(import.meta.url).pathname);

const port = process.env.PORT || 4000;

const corsOptions = {
    origin: 'http://localhost:5173',
    methods:['GET', 'POST', 'PUT', 'DELETE'],
    credentials: false
};

app.use(cors(corsOptions));

app.use(helmet());

app.use(morgan('dev'));

app.use(express.json());

app.use(express.urlencoded({extended: false}));

app.post('/enviarErrorPris', secControllers.EnviarErrorPris);

app.get('/getDataErrorPris', secControllers.GetDataErrorPris);

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});