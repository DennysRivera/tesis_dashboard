// Importación de modelos
import { Dispositivo, Medicion, Lectura, Ubicacion } from "../models/index.js";

// Importación para uso de operadores lógicos de Sequelize
import { Op } from "sequelize";

// Importación de clase para error personalizado
import { ErrorConCodigo } from "../utils/errorConCodigo.js";

// Función para obtener las lecturas recientes de todos los dispositivos
const obtenerDatos = async (req, res) => {
    try {
        // Fecha enviada desde el frontend
        const { fechaInicio } = req.query;

        // Se buscan todos los dispositivos existentes registrados
        const dispositivos = await Dispositivo.findAll({
            // JOIN con las tablas de Ubicaciones y Mediciones
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

            // Se ordenarán en orden alfabético
            order: ["dispositivo_id"]
        });

        if (!dispositivos) {
            throw new ErrorConCodigo("No se encontraron dispositivos", 404);
        }

        // Se consultarán a partir de una fecha de inicio
        // para evitar datos innecesarios
        // Solo se buscan los más recientes
        const lecturas = await Lectura.findAll({
            where: {
                createdAt: {
                    [Op.gte]: fechaInicio
                }
            },
            attributes: {
                exclude: ["updatedAt"]
            },
            // Se agrupan por id del dispositivo
            group: [
                ["dispositivo_id"],
                ["lectura_id"]
            ],
            // Se ordenan del más reciente al más antiguo
            order: [
                ["dispositivo_id"],
                ["createdAt", "DESC"]
            ],
            // Opción para no crear instancia del modelo
            raw: true
        });

        // Variables a usar para obtener las lecturas deseadas
        let lecturasMaximas;
        let lecturasRecientes;

        // Se recorrerá un arreglo con todos los dispositivos encontrados
        dispositivos.forEach((dispositivo) => {
            // Cada dispositivo tendrá un límite de 10 lecturas, las más recientes
            // que se almacenarán en un arreglo
            lecturasMaximas = 10;
            lecturasRecientes = [];

            let i = 0;

            // Bucle para obtener las 10 lecturas más recientes,
            // o todas las exiswtentes si son menos de 10
            while (lecturasMaximas > 0) {
                if (i >= lecturas.length) {
                    break;
                }

                // Como todas lecturas están en un solo arreglo,
                // se verifica si le pertenecen al dispositivo actual en el forEach
                if (lecturas[i].dispositivo_id === dispositivo.dispositivo_id) {
                    // Se inserta la lectura en el arreglo
                    // y se disminuye el número de elementos que puede aceptar
                    lecturasRecientes.push(lecturas[i]);
                    lecturasMaximas--;
                }
                i++;
            }

            lecturasRecientes.reverse();

            // Se agrega el arreglo de las lecturas recientes
            // al dispositivo correspondiente
            dispositivo.dataValues.lecturasRecientes = lecturasRecientes;
        });

        // Como respuesta se envía un arreglo con los dispositivos y
        // sus lecturas en formato JSON
        return res.json(dispositivos);
    } catch (error) {
        if (error.status) {
            res.statusMessage = error.message;
            return res.status(error.status).send(error.message);
        }
        console.log(error)
        return res.status(500).end();
    }
}

// Función para obtener las lecturas recientes y
// 24 horas antes de un dispositivo en específico
const obtenerDatosDispositivo = async (req, res, next) => {
    try {
        // Id del dispositivo deseado
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

        if (!dispositivo) {
            throw new ErrorConCodigo("Dispositivo no encontrado", 404);
        }

        // Consulta para las 10 lecturas más recientes del dispositivo
        const lecturasRecientes = await Lectura.findAll({
            where: {
                dispositivo_id
            },
            attributes: {
                exclude: ["updatedAt"]
            },
            order: [
                ["createdAt", "DESC"]
            ],
            limit: 10,
            raw: true
        });

        // Se invierte el orden del arreglo
        // para que las lecturas más antiguas
        // estén al inicio
        lecturasRecientes.reverse();

        // Se guarda la fecha de la lectura más antigua del arreglo
        let fecha = new Date(lecturasRecientes[0].createdAt);

        // Se modifica la fecha para 24 horas y 1 minuto antes
        // por margen de error del envío de datos al servidor TTN
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
            order: [
                ["createdAt", "ASC"]
            ],
            limit: 10,
            raw: true
        })

        // Se agrega el arreglo de las lecturas recientes y
        // anteriores al dispositivo
        dispositivo.dataValues.lecturasRecientes = lecturasRecientes;
        dispositivo.dataValues.lecturasAnteriores = lecturasAnteriores;

        // Como respuesta se envía el dispositivo y sus lecturas
        // en un arreglo de 1 elemento (por conveniencia en el frontend)
        // en formato JSON
        return res.json([dispositivo]);
    } catch (error) {
        if (error.status) {
            res.statusMessage = error.message;
            return res.status(error.status).send(error.message);
        }
        console.log(error)
        return res.status(500).end();
    }
}

// Función para obtener las lecturas de un dispositivo específico
// dentro de un rango de fechas
const lecturasEnTabla = async (req, res) => {
    try {
        /*
    Se guarda el id del dispositivo y
    las fechas de inicio y fin del rango para buscar
    
    La fecha final es excluyente, por lo que debe ser recibida
    con un día extra para buscar el rango deseado completo
    */
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
            // Se ordenan de la más antigua a la más reciente
            order: [
                ["createdAt", "ASC"]
            ],
            raw: true
        });

        if (lecturas.length <= 0) {
            throw new ErrorConCodigo("No hay lecturas en ese rango", 404);
        }

        // Como respuesta se envía un arreglo con todas las lecturas
        // del dispositivo dentro del rango de fechas en formato JSON
        return res.json(lecturas);
    } catch (error) {
        if (error.status) {
            res.statusMessage = error.message;
            return res.status(error.status).send(error.message);
        }
        console.log(error)
        return res.status(500).end();
    }
}

export {
    obtenerDatos,
    obtenerDatosDispositivo,
    lecturasEnTabla
}