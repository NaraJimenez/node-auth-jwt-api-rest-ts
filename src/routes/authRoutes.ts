import express from 'express';
import { login, register } from '../controllers/authController';

const router = express.Router();

//Rutas de autentificación - Devuelven Token
//Registro
router.post('/register', register);
//Login
router.post('/login', login);


//Exportamos routa
export default router;