import { Dispositivo, Medicion, Lectura, Ubicacion } from "../models/index.js";

const getData = async (req, res) => {
    const dispositivos = await Dispositivo.findAll();

    return res.json(dispositivos);
}

export {
    getData
}