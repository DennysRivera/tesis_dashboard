import { Dispositivo, Lectura } from "../models/index.js";

const postUplink = async (req, res) => {
    console.log(req.body.uplink_message.decoded_payload)
    console.log(req.body.end_device_ids.device_id)
    //console.log(req.body)
    try {
        const lectura = req.body.uplink_message.decoded_payload
        const dispositivoId = req.body.end_device_ids.device_id
        const dispositivo = await Dispositivo.findByPk(dispositivoId)

        if(!dispositivo){
            await Dispositivo.create({
                dispositivo_id: dispositivoId,
                medicion_id: lectura.measurement_id,
                ubicacion_id: lectura.location_id,
                dispositivo_lectura_intervalo: lectura.interval
            });

            await Lectura.create({
                lectura_valor: lectura.value,
                dispositivo_id: dispositivoId
            });
        }
        else{
            await Lectura.create({
                lectura_valor: lectura.value,
                dispositivo_id: dispositivoId
            });
        }
        return res.end()
    } catch (error) {
        console.log(error)
    }
}

export {
    postUplink
}