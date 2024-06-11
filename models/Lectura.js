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
    }
}, {
    tableName: 'Lecturas'
});

export default Lectura;
