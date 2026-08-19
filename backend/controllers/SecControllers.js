import bd from "../model/bd.js";
import {_dirname, io} from "../app.js";



const EnviarErrorPris = async (req, res)=>{
    try{

        let id= req.params.id;
        
            

        const DatosUser = await bd.BuscarUsuario(id)
            
            

        const ErrorPris = {
            fecha: new Date().toLocaleDateString().slice(0, 10),
            hora: new Date().toLocaleTimeString(),
            combustible: req.body.combustible,
            monto: req.body.monto,
            problema: req.body.problema,
            como_se_cobro: req.body.como_se_cobro,
            monto_cobrado: req.body.monto_cobrado,
            observaciones: req.body.observaciones,
            id_usuario: DatosUser.apellido
        }
            const data = await bd.InsertarErrorPris(ErrorPris);
        
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

const CrearCombustible = async (req, res) => {
    try {
        const combustible = req.body.nombre;
        const data = await bd.InsertCombustible(combustible);
        return res.status(200).json(data);
    } catch (error) {
        console.error('Error al crear el combustible:', error);
        return res.status(500).json({ mensaje: 'Error al crear el combustible' });
    }
};

const SelectCombustible = async (req , res)=>{
    try {
        const data = await bd.consultCombustible();
        console.log(data);
        return res.status(200).json(data);
    } catch (error) {
        console.error('Error al obtener los combustibles:', error);
        return res.status(500).json({ mensaje: 'Error al obtener los combustibles' });
    }
}

const SelectUsuario = async (req, res)=>{
    try {
        const data = await bd.consultUsuario();
    if(!data){
        return res.status(404).json({ mensaje: 'No se encontraron usuarios' });
    }
        return res.status(200).json(data);
    } catch (error) {
        console.error('Error al obtener los usuarios:', error);
        return res.status(500).json({ mensaje: 'Error al obtener los usuarios' });
    }
}

const PostUsuario = async (req, res)=>{
    try {
        
        const user = {
            apellido: req.body.apellido,
            password: req.body.password,
        }
        const data = await bd.SesionUsuario(user);
        
        console.log("El id del usuario", data.id);
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
};

const GetSesions = async (req, res) => {
    try {
        if(req.session.usuario){
            let id = req.session.usuario?.id;
       let rol = req.session.usuario?.rol;
       let apellido = req.session.usuario?.apellido;   
        
            return res.status(200).json({
                logueado:true,
                usuario: req.session.usuario,
            });


        }else{

    

        
        return res.status(401).json({logueado: false})
    }
    } catch (error) {
        console.error('Error al obtener las sesiones:', error);
        return res.status(500).json({ mensaje: 'Error al obtener las sesiones' });
    }
};

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
    GetRoles, 
    PostUsuario,
    GetSesions,
    SelectUsuario,
    CrearCombustible,
    SelectCombustible
}

