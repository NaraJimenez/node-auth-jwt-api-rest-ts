import { Request, Response } from "express";
import { hashPassword } from "../services/password.service";
import prisma from '../models/user'


//CREAMOS USUARIO
export const createUser = async (req:Request, res:Response): Promise<void> => {
    try {
        
        const { email, password } = req.body;

        if (!email) {
            res.status(400).json({ message: 'El email es obligatorio'});
            return;
        }
        
        if (!password) {
            res.status(400).json({ message: 'El password es obligatorio'});
            return;
        }

        const hashedPassword = await hashPassword(password);
        const user = await prisma.create(
            {
                data: {
                    email,
                    password: hashedPassword
                }
            }
        )

        //Si todo va bien
        res.status(201).json(user);



    } catch (error:any) {
        if (error?.code === 'P2002' && error?.meta?.target?.includes('email')) {
            res.status(400).json({ message: 'El email ingresado ya existe'});
        }

        console.log(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde'});
    }
}

//GETALL
export const getAllUsers = async (req:Request, res:Response): Promise<void> => {
    try {
        const users = await prisma.findMany();
        res.status(500).json(users);

    } catch (error:any) {
        console.log(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde'}); 
    }
}

//GET
export const getUserById = async (req:Request, res:Response): Promise<void> => {
    //Pasamos parametro del id
    const userId = parseInt(req.params.id);

    try {
        const user = await prisma.findUnique({
            where: {
                id: userId
            }
        })

        //Si no lo encuentra
        if (!user) {
            res.status(404).json({ error: 'El usuario no ha sido encontrado'});
            return;
        }
        
        //Si todo va bien
        res.status(200).json(user);

    } catch (error:any) {
        console.log(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde'}); 
    }
}

//UPDATE
export const updateUser = async (req:Request, res:Response): Promise<void> => {

    //Pasamos parametro del id
    const userId = parseInt(req.params.id);
    const { email, password } = req.body;

    try {

        //Info a actualizar email/pass
        let dataToUpdate: any = { ...req.body };

        if (password) {
            const hashedPassword = await hashPassword(password);
            dataToUpdate.password = hashedPassword;
        }

        if (email) {
            dataToUpdate.email = email;
        }

        //Busqueda
        const user = await prisma.update({
            where: {
                id: userId
            },
            data: dataToUpdate
        })
        
        //Si todo va bien
        res.status(200).json(user);

    } catch (error:any) {
        if (error?.code === 'P2002' && error?.meta?.target?.includes('email')) {
            res.status(400).json({ error: 'El email ingresado ya existe'});
        } else if (error?.code == 'P2005') {
            res.status(404).json( 'Usuario no encontrado');
        } else {
            console.log(error);
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde'});
        }
    }
}

//DELETE USER
export const deleteUser = async (req:Request, res:Response): Promise<void> => {
    //Pasamos parametro del id
    const userId = parseInt(req.params.id);

    try {
        await prisma.delete({
            where: {
                id: userId
            }
        })

        res.status(200).json({
            message: `El usuario ${userId} ha sido eliminado`
        }).end();

    } catch (error:any) {
        if (error?.code == 'P2005') {
            res.status(404).json( 'Usuario no encontrado');
        } else {
            console.log(error);
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde'});
        }
    }
}