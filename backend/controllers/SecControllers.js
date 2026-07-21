import bd from "../model/bd.js";


const EnviarErrorPris = async (req, res)=>{
    try{
        const ErrorPris = {
            fecha: req.body.fecha,
            hora: req.body.hora,
            combustible: req.body.combustible,
            problema: req.body.problema,
            como_se_cobro: req.body.como_se_cobro,
            observaciones: req.body.observaciones,
            id_usuario: req.body.id_usuario
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

export default{
    EnviarErrorPris,
    GetDataErrorPris
}
