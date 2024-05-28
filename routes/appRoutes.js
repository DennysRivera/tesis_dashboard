import express from 'express';
import { postUplink } from '../controllers/dispositivoController.js';
import { getData } from '../controllers/dashboardController.js';

const router = express.Router();

router.post('/uplinks', postUplink);
router.get('/dashboard', getData);

export default router;