import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Device = db.define('device', {
    id: {
        type: DataTypes.STRING,,
        primaryKey: true,
        allowNull: false
    },
    value: {
        type: DataTypes.ARRAY(DataTypes.FLOAT),
        defaultValue: []
    }
});

export default Device;