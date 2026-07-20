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

bd.run('CREATE TABLE IF NOT EXISTS ErrorPris(id TEXT PRIMARY KEY, fecha TEXT NOT NULL , hora TEXT NOT NULL , combustible TEXT , problema TEXT , como_se_cobro TEXT , observaciones TEXT , id_usuario TEXT NOT NULL , FOREIGN KEY (id_usuario) REFERENCES Usuario(id))');


bd.run('CREATE TABLE IF NOT EXISTS Usuario(id TEXT PRIMARY KEY , nombre TEXT , apellido TEXT , contraseña TEXT , rol TEXT)');

const InsertarErroePris = async (ErrorPris)=>{
  try{
     const id = uuidv4();
     let stmt = bd.prepare('INSERT INTO ErrorPris(id , fecha , hora , combustible , problema , como_se_cobro , observaciones, id_usuario) VALUES(?,?,?,?,?,?,?,?)');
     stmt.run(id, ErrorPris.fecha, ErrorPris.hora, ErrorPris.combustible, ErrorPris.problema, ErrorPris.como_se_cobro, ErrorPris.observaciones, ErrorPris.id_usuario);
     stmt.finalize();
     return { success: true, message: 'El problema se envio con exito' };

  }catch (error) {
    console.error('Error al insertar el problema:', error);
    return { success: false, message: 'Error al enviar el problema' };
  } 
};

