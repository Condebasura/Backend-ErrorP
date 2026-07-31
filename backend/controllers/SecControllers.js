import bd from "../model/bd.js";
import {_dirname, io} from "../app.js";


const EnviarErrorPris = async (req, res)=>{
    try{
        const ErrorPris = {
            fecha: new Date().toLocaleDateString().slice(0, 10),
            hora: new Date().toLocaleTimeString(),
            combustible: req.body.combustible,
            monto: req.body.monto,
            problema: req.body.problema,
            como_se_cobro: req.body.como_se_cobro,
            monto_cobrado: req.body.monto_cobrado,
            observaciones: req.body.observaciones,
            id_usuario: req.body.id_usuario
        }
            const data = await bd.InsertarErrorPris(ErrorPris);
            console.log(data);
            return res.status(200).json({mensaje: 'El problema se envio con exito'}); 
        } 

    catch(error){
        console.log(error);
    }
};

const GetDataErrorPris = async (req, res) => {
    try {
        const data = await bd.DataErrorPris();  
        return res.status(200).json(data);
    } catch (error) {
        console.error('Error al obtener los datos:', error);
        return res.status(500).json({ mensaje: 'Error al obtener los datos' });
    }
};

const CrearUsuario = async (req, res) => {
    try {
        const Usuario = {
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            password: req.body.password,
            rol: req.body.rol
        };
        const data = await bd.InsertarUsuario(Usuario);
        return res.status(200).json(data);
    } catch (error) {
        console.error('Error al crear el usuario:', error);
        return res.status(500).json({ mensaje: 'Error al crear el usuario' });
    }
};

const PostUsuario = async (req, res)=>{
    try {
        const user = {
            password: req.body.password,
        }
        const data = await bd.SesionUsuario(user);
        console.log("el usuario ingresado es:",data);
        if(!data){
            return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
        }else{
            req.session.usuario = {
                id: data.id,
                nombre: data.nombre,
                apellido: data.apellido,
                rol: data.rol
            };
            io.on('connection', socket =>{
                socket.on('register-session', userId =>{
                    socket.join(userId);
                })
            })
            const userId = req.session.usuario;
            io.emit('session:updated')
            return res.status(200).json({ok: true, userId});
        }
    } catch (error) {
        res.status(500).json({mensaje: 'Error interno del servidor', error})
    }
}

const GetRoles = async (req, res) => {
    try {
        const data = await bd.GetRoles();
        return res.status(200).json(data);
    } catch (error) {
        console.error('Error al obtener los roles:', error);
        return res.status(500).json({ mensaje: 'Error al obtener los roles' });
    }
};

export default{
    EnviarErrorPris,
    GetDataErrorPris,
    CrearUsuario,
    GetRoles
}

