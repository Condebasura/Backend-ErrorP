import sqlite3 from 'sqlite3';
import {v4 as uuidv4} from 'uuid';
import pkg from 'bcrypt';
import bcrypt from 'bcrypt';

const saltRounds = 10;
let bd = new sqlite3.Database('./data/DataBase.db', (err) => {
  if (err) {
    console.error('Error opening database', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

bd.run('CREATE TABLE IF NOT EXISTS ErrorPris(id TEXT PRIMARY KEY, fecha TEXT NOT NULL , hora TEXT NOT NULL , combustible TEXT ,monto text, problema TEXT , como_se_cobro TEXT ,monto_cobrado TEXT, observaciones TEXT , id_usuario TEXT , FOREIGN KEY (id_usuario) REFERENCES Usuario(id))');


bd.run('CREATE TABLE IF NOT EXISTS Usuario(id TEXT PRIMARY KEY , nombre TEXT , apellido TEXT , password TEXT , rol TEXT)');

bd.run('CREATE TABLE IF NOT EXISTS Roles(id TEXT PRIMARY KEY , rol TEXT)');

bd.run('CREATE TABLE IF NOT EXISTS Combustible(id TEXT PRIMARY KEY , combustible TEXT)');

bd.run('CREATE TABLE IF NOT EXISTS Tarjeta(id TEXT PRIMARY KEY , tarjeta TEXT)');

bd.run('CREATE TABLE IF NOT EXISTS Errores(id TEXT PRIMARY KEY , problema TEXT)');
const InsertarErrorPris = async (ErrorPris)=>{
  try{
     const id = uuidv4();
     let stmt = bd.prepare('INSERT INTO ErrorPris(id , fecha , hora , combustible ,monto, problema , como_se_cobro ,monto_cobrado, observaciones, id_usuario) VALUES(?,?,?,?,?,?,?,?,?,?)');
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
     let stmt = bd.prepare('INSERT INTO Usuario(id , nombre , apellido , password , rol) VALUES(?,?,?,?,?)');
     console.log(Usuario);
     stmt.run(id, Usuario.nombre, Usuario.apellido, await bcrypt.hash(Usuario.password, saltRounds), Usuario.rol);
     stmt.finalize();
     return { success: true, message: 'El usuario se ingresó con exito' };

  }catch (error) {
    console.error('Error al ingresar el usuario:', error);
    return { success: false, message: 'Error al ingresar el usuario' };
  } 
};

const InsertCombustible = async (combustible)=>{
  try{
     const id = uuidv4();
     let stmt = bd.prepare('INSERT INTO Combustible(id , combustible) VALUES(?,?)');
     stmt.run(id, combustible);
     stmt.finalize();
     return { success: true, message: 'El combustible se ingresó con exito' };
  }catch (error) {
    console.error('Error al ingresar el combustible:', error);
    return { success: false, message: 'Error al ingresar el combustible' };
  }
};

//Cambiar la logica de la funcion UpdateCombustible para que reciba el id del combustible a actualizar y el nuevo valor del combustible.
const UpdateCombustible = async (combustible)=>{
  try{
     let stmt = bd.prepare('UPDATE Combustible SET combustible = ? WHERE id = ?');
     stmt.run(combustible, id);
     stmt.finalize();
     return { success: true, message: 'El combustible se actualizó con exito' };
  }catch (error) {
    console.error('Error al actualizar el combustible:', error);
    return { success: false, message: 'Error al actualizar el combustible' };
  }
};

const InsertTarjeta = async (tarjeta)=>{

  try{
     const id = uuidv4();
     let stmt = bd.prepare('INSERT INTO Tarjeta(id , tarjeta) VALUES(?,?)');
     stmt.run(id, tarjeta);
     stmt.finalize();
     return { success: true, message: 'La tarjeta se ingresó con exito' };
  }catch (error) {
    console.error('Error al ingresar la tarjeta:', error);
    return { success: false, message: 'Error al ingresar la tarjeta' };
  }
};

const InsertProblema = async (problema)=>{

  try{
     const id = uuidv4();
     let stmt = bd.prepare('INSERT INTO Errores(id , problema) VALUES(?,?)');
     stmt.run(id, problema);
     stmt.finalize();
     return { success: true, message: 'El problema se ingresó con exito' };
  }catch (error) {
    console.error('Error al ingresar el problema:', error);
    return { success: false, message: 'Error al ingresar el problema' };
  }
};

const SearchProblema = async (problema)=>{
  return new Promise((resolve, reject)=>{
    bd.all('SELECT * FROM Errores WHERE problema LIKE ?', [`%${problema}%`], (error, row)=>{
      if(error){
        reject(error)
      }else{
        resolve(row)
      }
    })
  })
}

const EliminarProblema = (id)=>{
  let sql = 'DELETE FROM Errores WHERE id = ?';
  bd.run(sql,[id], (err)=>{
    if(err){
      console.log("Ocurio un error al eliminar el problema")
    }else{
      console.log("Problema eliminado correctamente")
    }
  })
}

const DataProblema = async ()=>{
  return new Promise((resolve, reject) => {
    bd.all('SELECT * FROM Errores', [], (error, rows) => {
      if (error) {
        reject(error);
      } else {
        resolve(rows);
      }
    });
})} 


const DataTarjeta = async ()=>{
  return new Promise((resolve, reject) => {
    bd.all('SELECT * FROM Tarjeta', [], (error, rows) => {
      if (error) {
        reject(error);
      } else {
        resolve(rows);
      }
    });
})}
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

const SearchUsuario = async (apellido)=>{
  return new Promise((resolve, reject)=>{
    bd.all('SELECT * FROM Usuario WHERE apellido LIKE ?', [`%${apellido}%`], (error, row)=>{
      if(error){
        reject(error)
      }else{
        resolve(row)
      }
    })
  })
};

const DataUsuario = async  (usuario)=>{
  try {
    return new Promise((resolve , reject)=>{
      let sql = 'SELECT * FROM Usuario WHERE id = ?';
      let id = usuario.id;
      bd.get(sql,[id], (err, row)=>{
        if(err){
          reject(err);

        }else{
          resolve(row)
        }
      })
    })
  } catch (error) {
    console.log("El usuario no existe", error)
  }
}


const consultUsuario = async ()=>{
  return new Promise((resolve , reject)=>{
    bd.all('SELECT * FROM Usuario', (error, rows) => {
      if (error) {
        reject(error);
      } else {
        resolve(rows);
      }
    });
  })
}

const UpdateUsuario = async (usuario)=>{
  try {
    
    const hashedPassword = await bcrypt.hash(usuario.password , saltRounds)
    
      const sql = 'UPDATE  Usuario SET id = ? , nombre = ? , apellido = ? , password = ? , rol = ? WHERE id = ?';
      bd.run(sql , [usuario.id , usuario.nombre , usuario.apellido , hashedPassword , usuario.rol , usuario.id], (err)=>{
        if(err){
          console.log(err.message)
        }else{
          console.log('Datos actualizados correctamente')
        }
      })
  } catch (error) {
    console.log(error.message)
  }

}

const UpdateUsuarioSinPassword = async (user)=>{
  try {
      const sql = 'UPDATE  Usuario SET id = ? , nombre = ? , apellido = ? , rol = ? WHERE id = ?';
      bd.run(sql , [user.id , user.nombre , user.apellido , user.rol , user.id], (err)=>{
        if(err){
          console.log(err.message)
        }else{
          console.log('Datos actualizados correctamente')
        }
      })
  } catch (error) {
    console.log(error.message)
  }
}

const DeleteUsuario = (id)=>{
  let sql = 'DELETE FROM Usuario WHERE id = ?';
  bd.run(sql,[id],(err)=>{
    if(err){
      console.log("Error al eliminar el usuario");
    }else{
      console.log("El usuario se elimino correctamente")
    }
  })
}

const consultCombustible = async ()=>{
  return new Promise((resolve , reject)=>{
    bd.all('SELECT * FROM Combustible', (error, rows) => {
      if (error) {
        reject(error);
      } else {
        resolve(rows);
      }
    });
  })
};

const SearchCombustible = async (combustible)=>{
  return new Promise((resolve, reject) => {
    bd.all('SELECT * FROM Combustible WHERE combustible LIKE ?', [`%${combustible}%`], (error, row) => {
      if (error) {
        reject(error);
      } else {
        resolve(row);
      }
    });
  });
};

const DeleteCombustible = (id)=>{
  let sql = 'DELETE FROM Combustible WHERE id = ?';
  bd.run(sql,[id],(err)=>{
    if(err){
      console.log("Error al eliminar el tipo de combustible");
    }else{
      console.log("El combustible se elimino correctamente")
    }
  })
}

const SearchTarjeta = async (tarjeta)=>{
  return new Promise((resolve , reject)=>{
   bd.all('SELECT * FROM Tarjeta WHERE tarjeta LIKE  ?' , [`%${tarjeta}%`], (err, row)=>{
    if(err){
      reject(err)
    }else{
      resolve(row)
    }
   })
  })
}

const EliminarTarjeta = (id)=>{
  let sql = 'DELETE FROM Tarjeta WHERE id = ?';
  bd.run(sql,[id], (err)=>{
    if(err){
      console.log("Ocurio un error al eliminar la tarjeta")
    }else{
      console.log("Tarjeta eliminada correctamente")
    }
  })
}

const SesionUsuario = (user) =>{
  return new Promise((resolve, reject)=>{
    let sql = 'SELECT * FROM Usuario WHERE apellido = ?';
    let usuario = user.apellido;
    let password = user.password;
    bd.get(sql, [usuario], async (error, row) => {
      if (error) {
        reject(error);
      } if(!row) {
        resolve(false);
      }
      
      try{
        const PasswordMatch = await  bcrypt.compare(password , row.password);
        if(!PasswordMatch){
          resolve(false);
        }
          resolve(row);
        
      }catch(bcryptError){
        
          console.error('Error al comparar las contraseñas:', bcryptError);
        reject(bcryptError);
      }
      
    });
  })
}

const GetRoles = async () =>{
  return new Promise((resolve, reject) => {
    bd.all('SELECT * FROM Roles', [], (error, rows) => {
      if (error) {
        reject(error);
      } else {
        resolve(rows);
      } 
    })
    })
};


export default{
  InsertarErrorPris,
  DataErrorPris,
  InsertarUsuario,
  BuscarUsuario,
  SesionUsuario,
  GetRoles, 
  consultUsuario,
  InsertCombustible,
  UpdateCombustible,
  consultCombustible,
  InsertTarjeta,
  DataTarjeta,
  InsertProblema,
  DataProblema,
  SearchCombustible,
  DeleteCombustible,
  SearchTarjeta,
  EliminarTarjeta,
  SearchProblema,
  EliminarProblema,
  SearchUsuario,
  DataUsuario,
  UpdateUsuario,
  UpdateUsuarioSinPassword, 
  DeleteUsuario
}