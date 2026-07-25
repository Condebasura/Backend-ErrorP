import sqlite3 from 'sqlite3';
import {v4 as uuidv4} from 'uuid';
import pkg from 'bcrypt';

const {bcrypt} = pkg;
const saltRounds = 10;
let bd = new sqlite3.Database('./data/DataBase.db', (err) => {
  if (err) {
    console.error('Error opening database', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

bd.run('CREATE TABLE IF NOT EXISTS ErrorPris(id TEXT PRIMARY KEY, fecha TEXT NOT NULL , hora TEXT NOT NULL , combustible TEXT , problema TEXT , como_se_cobro TEXT , observaciones TEXT , id_usuario TEXT , FOREIGN KEY (id_usuario) REFERENCES Usuario(id))');


bd.run('CREATE TABLE IF NOT EXISTS Usuario(id TEXT PRIMARY KEY , nombre TEXT , apellido TEXT , contraseña TEXT , rol TEXT)');

bd.run('CREATE TABLE IF NOT EXISTS Roles(id TEXT PRIMARY KEY , rol TEXT)');

const InsertarErrorPris = async (ErrorPris)=>{
  try{
     const id = uuidv4();
     let stmt = bd.prepare('INSERT INTO ErrorPris(id , fecha , hora , combustible ,monto, problema , como_se_cobro ,monto_cobrado, observaciones, id_usuario) VALUES(?,?,?,?,?,?,?,?)');
     stmt.run(id, ErrorPris.fecha, ErrorPris.hora, ErrorPris.combustible,ErrorPris.monto, ErrorPris.problema, ErrorPris.como_se_cobro,ErrorPris.monto_cobrado, ErrorPris.observaciones, ErrorPris.id_usuario);
     stmt.finalize();
     console.log(ErrorPris);
     return { success: true, message: 'El problema se envio con exito' };

  }catch (error) {
    console.error('Error al insertar el problema:', error);
    return { success: false, message: 'Error al enviar el problema' };
  } 
};
  
const InsertarUsuario = async (Usuario)=>{
  try{
     const id = uuidv4();
     let stmt = bd.prepare('INSERT INTO Usuario(id , nombre , apellido , contraseña , rol) VALUES(?,?,?,?,?)');
     stmt.run(id, Usuario.nombre, Usuario.apellido, await bcrypt.hash(Usuario.contraseña, saltRounds), Usuario.rol);
     stmt.finalize();
     return { success: true, message: 'El usuario se ingresó con exito' };

  }catch (error) {
    console.error('Error al ingresar el usuario:', error);
    return { success: false, message: 'Error al ingresar el usuario' };
  } 
};

const DataErrorPris = async ()=>{
  return new Promise((resolve, reject) => {
    bd.all('SELECT * FROM ErrorPris', [], (error, rows) => {
      if (error) {
        reject(error);
      } else {
        resolve(rows);
      }
    });
  });
};

const BuscarUsuario = async (id) => {
  return new Promise((resolve, reject) => {
    bd.get('SELECT * FROM Usuario WHERE id = ?', [id], (error, row) => {
      if (error) {
        reject(error);
      } else {
        resolve(row);
      }
    });
  });
};

const SesionUsuario = async (user) =>{
  return new Promise((resolve, reject)=>{
    let sql = 'SELECT * FROM Usuario WHERE contraseña = ?';
    let contraseña = user.contraseña;
    bd.get(sql, [contraseña], (error, row) => {
      if (error) {
        reject(error);
      } if(!row) {
        resolve(false);
      }
      try{
        const PasswordMatch =  bcrypt.compare(contraseña , row.contraseña);
        if(PasswordMatch){
          resolve(row);
        }else{
          resolve(false);
        }
      }catch(error){
        if (error) {
          console.error('Error al comparar las contraseñas:', bcryptError);
        reject(btcryptError);
      }
      }
    });
  })
}

export default{
  InsertarErrorPris,
  DataErrorPris,
  InsertarUsuario,
  BuscarUsuario,
  SesionUsuario
}