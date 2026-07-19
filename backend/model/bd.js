import sqlite3 from 'sqlite3';
import {v4 as uuidv4} from 'uuid';
import {bcrypt} from 'bcrypt';
const saltRounds = 10;
let bd = new sqlite3.Database('/data/DataBase.db', (err) => {
  if (err) {
    console.error('Error opening database', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

