import express from "express";
import db from "./config/db.js";
import Device from "./models/Device.js";

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({extended: true}))

try {
    await db.authenticate();
    await db.sync();
    console.log("DB connected");
} catch (error) {
    console.log(error);
}

app.post("/uplinks", async (req, res) => {
    console.log(req.body.uplink_message.decoded_payload.str)
    console.log(req.body.identifiers.device_ids.device_id)
    const value = req.body.uplink_message.decoded_payload.str
    const deviceId = req.body.identifiers.device_ids.device_id
    try {
        let device = await Device.findByPk(deviceId)
        if(!device){
            await Device.create({
                id: deviceId,
                value: [value]
            })
        }
        else{
            device.value = [value]
            device.save()
        }
    } catch (error) {
        console.log(error)
    }
})

app.listen(port, () => {
    console.log("Connected")
})