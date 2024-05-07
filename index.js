import express from "express";
import db from "./config/db";

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

app.post("/uplinks", (req, res) => {
    console.log(req.body.uplink_message.decoded_payload.str)
})

app.listen(port, () => {
    console.log("Connected")
})