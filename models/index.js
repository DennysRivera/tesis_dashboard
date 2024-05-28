import Dispositivo from "./Dispositivo.js";
import Lectura from "./Lectura.js";
import Medicion from "./Medicion.js";
import Sector from "./Sector.js";
import Ubicacion from "./Ubicacion.js";

/*Ubicacion.belongsTo(Sector, {
    foreignKey: "sectorId"
});*/
Medicion.hasOne(Dispositivo, {
    foreignKey: "medicionId"
});
Dispositivo.belongsTo(Ubicacion, {
    foreignKey: "ubicacionId"
});
Lectura.belongsTo(Dispositivo, {
    foreignKey: "dispositivoId"
});

export {
    Dispositivo,
    Lectura,
    Medicion,
    Sector,
    Ubicacion
}