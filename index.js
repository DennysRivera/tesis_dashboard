// Importanción de módulos:
// express como módulo principal para usar el framework
// cors para la configuración CORS
import express from "express";
import cors from "cors";

// Importación de librerías
// db que contiene la configuración para la conexión a la base de datos
// router que contiene las rutas disponibles en la aplicación
import db from "./config/db.js";
import router from "./routes/appRoutes.js";

/*
Se inicia ina instancia de express,
junto con una variable que almacenará el puerto
a usar a partir de una variable de entorno
o el 3000 por defecto si no existe la variable
*/
const app = express();
const port = process.env.PORT || 3000

// Middleware proporcionado por express para
// la lectura del cuerpo de una petición en formato JSON
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Activación CORS simple
app.use(cors());

// Se inicia la conexión a la BD
// y se imprime un error si falla
try {
    await db.authenticate();
    await db.sync();
    console.log("DB connected");
} catch (error) {
    console.log(error);
}

// Rutas que estarán disponibles en la aplicación
// En este caso comprobará cualquier ruta que empiece con ""
// De encontrar alguna, ejecutará el middleware asignado
app.use("", router);

// Se levanta el servidor, que estará pendiente
// del puerto asignado en port
// Se imprime un mensaje para saber que funcionó
app.listen(port, () => {
    console.log("Connected");
})
