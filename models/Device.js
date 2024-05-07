import { DataTypes } from "sequelize";
import db from "../config/db";

const Device = db.define('device', {
    id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    value: {
        type: DataTypes.ARRAY(DataTypes.FLOAT),
        defaultValue: []
    }
});

export default Device;