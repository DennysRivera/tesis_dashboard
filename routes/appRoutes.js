import express from 'express';
import { postUplink } from '../controllers/dispositivoController.js';
import { obtenerDatos } from '../controllers/dashboardController.js';

const router = express.Router();

router.post('/uplinks', postUplink);
router.get('/dashboard', obtenerDatos);

export default router;