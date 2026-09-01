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

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
    }
});

const sessionMiddleware = session({
    secret: 'petro_tanque_ruido',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        sameSite: true
    }
  
});

app.use(sessionMiddleware);
io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
});

io.on('connection', (socket) => {
    console.log('🟢 Un usuario se ha conectado', socket.id);
    const session = socket.request.session;
    const userId = session?.usuario?.id;
    if(userId){
        socket.join(userId);
    }
    socket.on('disconnect', () => {
        console.log('🔴 Un usuario se ha desconectado', socket.id

        );
    });
});


const corsOptions = {
    origin: 'http://localhost:5173',
    methods:['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
};

app.use(cors(corsOptions));

app.use(helmet());

app.use(morgan('dev'));

app.use(express.json());

app.use(express.urlencoded({extended: false}));
app.use(session({
    secret: 'petro_tanque_ruido',
    resave: false,
    saveUninitialized: false
}))

app.post('/enviarErrorPris/:id', secControllers.EnviarErrorPris);
app.post('/crearUsuario', secControllers.CrearUsuario);
app.post('/postUsuario', secControllers.PostUsuario);
app.post('/crearCombustible', secControllers.CrearCombustible);
app.post('/crearProblema', secControllers.CrearProblema);
app.get('/Sesions', secControllers.GetSesions);
app.get('/selectUsuario', secControllers.SelectUsuario);
app.get('/getDataErrorPris', secControllers.GetDataErrorPris);
app.get('/getRoles', secControllers.GetRoles);
app.get('/selectCombustible', secControllers.SelectCombustible);
app.post('/crearTarjeta', secControllers.CrearTarjeta);
app.get('/selectTarjeta', secControllers.SelectTarjeta);
app.get('/selectProblema', secControllers.SelectProblema);
app.post('/searchCombustible', secControllers.SearchCombustible);
app.post('/SearchTarjeta', secControllers.SearchTarjeta);
app.post("/SearchProblema", secControllers.searchProblema)
app.post('/searchUsuario', secControllers.SearchUsuario);
app.delete('/eliminarCombustible/:id', secControllers.EliminarCombustible)
app.delete('/eliminarTarjeta/:id', secControllers.EliminarTarjeta);
app.delete("/eliminarProblema/:id", secControllers.EliminarProblema);
app.put("/modificarUsuario", secControllers.ActualizarUsuario);
app.delete("/eliminarUsuario/:id", secControllers.EliminarUsuario);

server.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});

export{
    _dirname,
    io
}