import { Dispositivo, Medicion, Lectura, Ubicacion } from "../models/index.js";
import db from "../config/db.js";

const obtenerDatos = async (req, res) => {
    const test = await db.query("select * from obtener_lecturas('a')");
    
    const dispositivos = await Dispositivo.findAll({
        include: [{
            model: Ubicacion,
            as: "ubicacion",
            attributes: [ "ubicacion_nombre", "ubicacion_tipo" ]
        }, {
            model: Medicion,
            as: "medicion",
            attributes: {
                exclude: [ "medicion_id", "createdAt", "updatedAt" ]
            }
        }],
        order: ["dispositivo_id"]
    });

    const lecturas = await Lectura.findAll({
        attributes: {
            exclude: [ "updatedAt" ]
        },
        group: [
            ["dispositivoId"],
            ["lectura_id"]
        ],
        order: [
            ["dispositivoId"],
            ["createdAt", "DESC"]
        ],
        raw: true
    })
    
    let lecturasMaximas;
    let lecturasRecientes;

    dispositivos.forEach((dispositivo) => {
        lecturasMaximas = 10;
        lecturasRecientes = [];

        let i = 0;
        while(lecturasMaximas > 0){
            if(i >= lecturas.length){
                break;
            }
            if(lecturas[i].dispositivoId === dispositivo.dispositivo_id){
                lecturasRecientes.push(lecturas[i]);
                lecturasMaximas--;
            }
            i++;
        }

        /*lecturas.forEach((lectura) => {
            if(lectura.dispositivoId === dispositivo.dispositivo_id && lecturasMaximas > 0){
                lecturasMaximas--;
                lecturasRecientes.push(lectura)
            }
        });*/
        
        dispositivo.dataValues.lecturasRecientes = lecturasRecientes;
    });

    return res.json(dispositivos);
}

export {
    obtenerDatos
}