import { Request, Response } from 'express';
import { comparePasswords, hashPassword } from '../services/password.service';
import prisma from '../models/user'
import { generateToken } from '../services/auth.service';

export const register = async(req: Request, res: Response): Promise<void> => {

    const { email, password } = req.body;

    try {
        
        if (!email) {
            res.status(400).json({ message: 'El email es obligatorio'});
            return;
        }
        
        if (!password) {
            res.status(400).json({ message: 'El password es obligatorio'});
            return;
        }

        const hashedPassword = await hashPassword(password);
        console.log(hashedPassword);

        //Instacia de prisma para conectar con la BBDD SQL
        const user = await prisma.create(
            {
                data: {
                    email,
                    password: hashedPassword
                }
            }
        );

        //Token para que quede registrado
        const token = generateToken(user);
        //Status 201 - Creado correctamente y estando logeado
        res.status(201).json({ token });

    } catch (error:any) {
        //Si es duplicado (para ver el error P2002 - en terminal)
        if (error?.code === 'P2002' && error?.meta?.target?.includes('email')) {
            res.status(400).json({ message: 'El email ingresado ya existe'});
        }

        console.log(error);
        res.status(500).json({ error: 'Error en el registro'});
    }
}  

//LOGIN
export const login = async (req: Request, res: Response): Promise<void> => {
    //Destructuramos el body
    const { email, password } = req.body;

    try {
        if (!email) {
            res.status(400).json({ message: 'El email es obligatorio'});
            return;
        }
        
        if (!password) {
            res.status(400).json({ message: 'El password es obligatorio'});
            return;
        }

        //Prisma va a buscar por email, ya que es UNIQUE
        const user = await prisma.findUnique({ where : { email }})

        if (!user) {
            res.status(404).json({ error: 'Usuario no encontrado'});
            return;
        }

        //Comparación con hash
        const passwordMatch = await comparePasswords(password, user.password)
        if(!passwordMatch) {
            res.status(401).json({ error: 'Usuario y contraseña no coinciden'});
        }

        //Si NO es erroneo
        const token = generateToken(user);
        res.status(201).json({ token });

    } catch (error:any) {
        console.log('Error:', error);
    }

}