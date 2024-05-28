import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Ubicacion = db.define('ubicacion', {
    ubicacion_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    ubicacion_nombre: {
        type: DataTypes.STRING(60),
        allowNull: false
    },
    ubicacion_tipo: {
        type: DataTypes.STRING(30),
        allowNull: false
    }
}, {
    tableName: 'Ubicaciones'
});

export default Ubicacion;
