import express from 'express';
import { postUplink } from '../controllers/dispositivoController.js';
import { obtenerDatos, obtenerDatosDispositivo, lecturasEnTabla } from '../controllers/dashboardController.js';

const router = express.Router();

router.post('/uplinks', postUplink);
router.get('/dashboard', obtenerDatos);
router.get('/:id', obtenerDatosDispositivo);
router.get('/:id/tabla', lecturasEnTabla);

export default router;