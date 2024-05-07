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
    //console.log(req.body.identifiers.device_ids.device_id)
    console.log(req.body)

})

app.get("/dashboard", (req, res) => {
    res.send("Connected");
})

app.listen(port, () => {
    console.log("Connected")
})