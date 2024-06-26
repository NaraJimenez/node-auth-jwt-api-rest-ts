import bcrypt, { hash } from 'bcrypt';

//Saltos para hacer segura la app
const SALT_ROUNDS: number = 10;

//Hash la password
export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, SALT_ROUNDS);
}

//Leer y comparar con el has de la BBDD
export const comparePasswords = async (password: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(password, hash);
}
