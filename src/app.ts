import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import authRoutes from './routes/authRoutes';
import usersRoutes from './routes/userRoutes';


const app = express();

//Middleware
app.use(express.json());

//Routas
app.use('/auth', authRoutes);
app.use('/users', usersRoutes);


//Autentificación

//Usuario - Listado de users

export default app;