import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Dispositivo = db.define('dispositivo', {
    dispositivo_id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    dispositivo_lectura_intervalo: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    coordenadas: DataTypes.ARRAY(DataTypes.STRING)
}, {
    tableName: 'Dispositivos'
});

export default Dispositivo;
