import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Lectura = db.define('lectura', {
    lectura_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    lectura_valor: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    lectura_intervalo: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    lectura_intervalo_unidad: {
        type: DataTypes.STRING(10),
        allowNull: false
    }
}, {
    tableName: 'Lecturas'
});

export default Lectura;
