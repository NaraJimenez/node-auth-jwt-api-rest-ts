//Rutas de Users
import express, { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from '../controllers/usersController';


const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'default-secret';


//Middleware de JWT - Para verificar si estamos autentificados
const authentificateToken = (req: Request, res: Response, next: NextFunction) => {
    //Para leer el header (los token se manda ha través de estos)
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    //Si no hay token
    if (!token) {
        return res.status(401).json({ error: 'No autorizado'});
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        //Si da error
        if (err) {
            console.error('Error en la autentificación: ', err);
            return res.status(403).json({ error: 'No tienes acceso a este recurso' });
        }

        //Si no tiene error
        next();

    })

}

//API
router.post('/', authentificateToken, createUser );
router.get('/', authentificateToken, getAllUsers );
router.get('/:id', authentificateToken, getUserById );
router.put('/:id', authentificateToken, updateUser );
router.delete('/:id', authentificateToken, deleteUser );


export default router;