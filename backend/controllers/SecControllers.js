import bd from "../model/bd.js";


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
            contraseña: req.body.contraseña,
            rol: req.body.rol
        };
        const data = await bd.InsertarUsuario(Usuario);
        return res.status(200).json(data);
    } catch (error) {
        console.error('Error al crear el usuario:', error);
        return res.status(500).json({ mensaje: 'Error al crear el usuario' });
    }
};

export default{
    EnviarErrorPris,
    GetDataErrorPris,
    CrearUsuario
}
