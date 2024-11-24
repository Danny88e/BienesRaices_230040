import { DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';
import db from '../db/db.js';

const Usuario = db.define('usuarios', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    token: DataTypes.STRING,
    confirmado: DataTypes.BOOLEAN,
    fecha_nacimiento: {
        type: DataTypes.DATEONLY, 
        allowNull: false
    }
}, {
    hooks: {
        beforeCreate: async function(usuario) {
            // Generamos la clave para el hasheo, se recomiendan 10 rondas de aleatorización para no consumir demasiados recursos de hardware y hacer lento el proceso.
            const salt = await bcrypt.genSalt(10);
            usuario.password = await bcrypt.hash(usuario.password, salt);
        }
    }
});

export default Usuario;
