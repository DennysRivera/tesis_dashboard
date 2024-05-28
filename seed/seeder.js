import mediciones from './mediciones.js';
import sectores from './sectores.js';
import ubicaciones from './ubicaciones.js';
import db from '../config/db.js';
import { Medicion, Sector, Ubicacion } from '../models/index.js';

const importData = async () => {
    try {
        await db.authenticate();
        await db.sync();

        await Promise.all([
            Medicion.bulkCreate(mediciones),
            Sector.bulkCreate(sectores),
            Ubicacion.bulkCreate(ubicaciones)
        ]);

        /*
        await Medicion.bulkCreate(mediciones);

        const sectoresLista = await Sector.bulkCreate(sectores);
        sectoresLista.forEach((sector) => {
            ubicaciones.forEach((ubicacion) => {
                if(ubicacion.ubicacion_nombre.match(/Aula A/i) && sector.sector_nombre.match(/Aulas 'A'/i)){
                    ubicacion.sectorId = sector.sector_id;
                }
                else if(ubicacion.ubicacion_nombre.match(/Aula B/i) && sector.sector_nombre.match(/Aulas 'B'/i)){
                    ubicacion.sectorId = sector.sector_id;
                }
                else if(ubicacion.ubicacion_nombre.match(/Aula D/i) && sector.sector_nombre.match(/Aulas 'D'/i)){
                    ubicacion.sectorId = sector.sector_id;
                }
                else if(ubicacion.ubicacion_nombre.match(/Magna/) && sector.sector_nombre.match(/Magna/)){
                    ubicacion.sectorId = sector.sector_id;
                }
                else if(ubicacion.ubicacion_nombre.match(/Cancha/) && sector.sector_nombre.match(/Polideportivo/)){
                    ubicacion.sectorId = sector.sector_id;
                }
                else if(ubicacion.ubicacion_nombre.match(/Estacionamiento/) && sector.sector_nombre.match(/Estacionamiento/)){
                    ubicacion.sectorId = sector.sector_id;
                }
                else if(ubicacion.ubicacion_nombre.match(/Magna/) && sector.sector_nombre.match(/Magna/)){
                    ubicacion.sectorId = sector.sector_id;
                }
            })
        })

        

        console.log(ubicaciones);
        await Ubicacion.bulkCreate(ubicaciones);*/

        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

const deleteData = async () => {
    try {
        await db.sync({ force: true });
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

if (process.argv[2] === "-i") {
    importData();
}

if (process.argv[2] === "-d") {
    deleteData();
}