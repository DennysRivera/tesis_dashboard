import express from "express";
import cors from "cors";
import db from "./config/db.js";
import router from "./routes/appRoutes.js";

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

app.use("", router);

app.listen(port, () => {
    console.log("Connected")
})
