import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Medicion = db.define('medicion', {
    medicion_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    medicion_fenomeno: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    medicion_descripcion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    medicion_unidad: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    medicion_unidad_abreviatura: {
        type: DataTypes.STRING(15),
        allowNull: true
    }
}, {
    tableName: 'Mediciones'
});

export default Medicion;
