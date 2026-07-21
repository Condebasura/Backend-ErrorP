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

