import { Dispositivo, Medicion, Lectura, Ubicacion } from "../models/index.js";
import db from "../config/db.js";
import { Op } from "sequelize";

const obtenerDatos = async (req, res) => {
    //const test = await db.query("select * from obtener_lecturas('a')");

    const dispositivos = await Dispositivo.findAll({
        include: [{
            model: Ubicacion,
            as: "ubicacion",
            attributes: ["ubicacion_nombre", "ubicacion_tipo"]
        }, {
            model: Medicion,
            as: "medicion",
            attributes: {
                exclude: ["medicion_id", "createdAt", "updatedAt"]
            }
        }],
        order: ["dispositivo_id"]
    });

    const lecturas = await Lectura.findAll({
        attributes: {
            exclude: ["updatedAt"]
        },
        group: [
            ["dispositivo_id"],
            ["lectura_id"]
        ],
        order: [
            ["dispositivo_id"],
            ["createdAt", "DESC"]
        ],
        raw: true
    });

    let lecturasMaximas;
    let lecturasRecientes;

    dispositivos.forEach((dispositivo) => {
        lecturasMaximas = 10;
        lecturasRecientes = [];

        let i = 0;
        while (lecturasMaximas > 0) {
            if (i >= lecturas.length) {
                break;
            }
            if (lecturas[i].dispositivo_id === dispositivo.dispositivo_id) {
                lecturasRecientes.unshift(lecturas[i]);
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
        lecturasRecientes.forEach((lectura) => {
            lectura.createdAt = {
                hora: new Date(lectura.createdAt).toLocaleTimeString(undefined, { hour12: false, hour: "2-digit", minute: "2-digit" }),
                fecha: new Date(lectura.createdAt).toLocaleDateString()
            }
        });
        dispositivo.dataValues.lecturasRecientes = lecturasRecientes;
    });

    return res.json(dispositivos);
}

const obtenerDatosDispositivo = async (req, res) => {
    const dispositivo_id = req.params.id;

    const dispositivo = await Dispositivo.findByPk(dispositivo_id, {
        include: [{
            model: Ubicacion,
            as: "ubicacion",
            attributes: ["ubicacion_nombre", "ubicacion_tipo"]
        }, {
            model: Medicion,
            as: "medicion",
            attributes: {
                exclude: ["medicion_id", "createdAt", "updatedAt"]
            }
        }],
        order: ["dispositivo_id"]
    });

    //TODO: Realizar una sola consulta

    const lecturasRecientes = await Lectura.findAll({
        where: {
            dispositivo_id
        },
        attributes: {
            exclude: ["updatedAt"]
        },
        /*group: [
            ["dispositivo_id"],
            ["lectura_id"]
        ],*/
        order: [
            //["dispositivo_id"],
            ["createdAt", "DESC"]
        ],
        limit: 10,
        raw: true
    });

    let fecha = new Date(lecturasRecientes[lecturasRecientes.length - 1].createdAt);

    fecha.setDate(fecha.getDate() - 1);
    fecha.setMinutes(fecha.getMinutes() - 1);
    fecha = fecha.toISOString();

    const lecturasAnteriores = await Lectura.findAll({
        where: {
            dispositivo_id,
            createdAt: {
                [Op.gte]: fecha
            }
        },
        attributes: {
            exclude: ["updatedAt"]
        },
        /*group: [
            ["dispositivo_id"],
            ["lectura_id"]
        ],*/
        order: [
            //["dispositivo_id"],
            ["createdAt", "ASC"]
        ],
        limit: 10,
        raw: true
    })

    lecturasRecientes.reverse();
    lecturasRecientes.forEach((lectura) => {
        lectura.createdAt = {
            hora: new Date(lectura.createdAt).toLocaleTimeString("es-SV", { hour12: false, hour: "2-digit", minute: "2-digit" }),
            fecha: new Date(lectura.createdAt).toLocaleDateString()
        }
    });

    lecturasAnteriores.forEach((lectura) => {
        lectura.createdAt = {
            hora: new Date(lectura.createdAt).toLocaleTimeString(undefined, { hour12: false, hour: "2-digit", minute: "2-digit" }),
            fecha: new Date(lectura.createdAt).toLocaleDateString()
        }
    });

    dispositivo.dataValues.lecturasRecientes = lecturasRecientes;
    dispositivo.dataValues.lecturasAnteriores = lecturasAnteriores;
    console.log(dispositivo.dataValues)
    return res.json([dispositivo]);

}

const lecturasEnTabla = async (req, res) => {
    const dispositivo_id = req.params.id;
    const { fechaInicio, fechaFin } = req.query;

    const lecturas = await Lectura.findAll({
        where: {
            dispositivo_id,
            createdAt: {
                [Op.and]: {
                    [Op.gte]: fechaInicio,
                    [Op.lt]: fechaFin
                }
            }
        },
        attributes: {
            exclude: ["lectura_id", "updatedAt", "dispositivo_id"]
        },
        order: [
            ["createdAt", "ASC"]
        ],
        raw: true
    })

    return res.json(lecturas);
}

export {
    obtenerDatos,
    obtenerDatosDispositivo,
    lecturasEnTabla
}