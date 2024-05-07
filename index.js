import express from "express";
import db from "./config/db.js";
import Device from "./models/Device.js";
import cors from "cors";

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())

try {
    await db.authenticate();
    await db.sync();
    console.log("DB connected");
} catch (error) {
    console.log(error);
}

app.post("/uplinks", async (req, res) => {
    console.log(req.body.uplink_message.decoded_payload.str)
    console.log(req.body.end_device_ids.device_id)
    console.log(req.body)
    try {
        const value = req.body.uplink_message.decoded_payload.str
        const deviceId = req.body.end_device_ids.device_id
        let device = await Device.findByPk(deviceId)
        if(!device){
            await Device.create({
                id: deviceId,
                value: [Number(value)]
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

app.get("/dashboard", async (req, res) => {
    const devices = await Device.findAll();
    return res.json(devices);
})

app.listen(port, () => {
    console.log("Connected")
})