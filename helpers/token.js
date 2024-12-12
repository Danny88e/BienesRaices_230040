import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';

const generateJWT= datos => jwt.sign({
    id:datos.id,
    nombre: 'Luis Daniel',
    enterprise: 'Ut xicotepec',
    software: 'Aplicaciones de Bienes Raices'


    }, process.env.JWT_SECRET,{
        expiresIn: '1d'
    }
)

const generateId = () => Math.random().toString(32).substring(2) + Date.now().toString(32);

export {
    
    generateJWT
,
    generateId}