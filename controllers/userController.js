import { check, validationResult } from 'express-validator';
import { generateId } from '../helpers/token.js';
import Usuario from "../models/Usuario.js";
import { emailRegister } from '../helpers/emails.js';

// Formulario de login
const formularioLogin = (request, response) => {
    response.render('auth/login', {
        pagina: "Inicia sesión"
    });
};

// Formulario de registro
const formularioRegister = (request, response) => {
    response.render('auth/register', {
        pagina: "Crea tu cuenta",
        csrfToken: request.csrfToken()
    });
};

const createNewUser = async (request, response) => {
    // Validación de campos
    await check('nombre_usuario').notEmpty().withMessage('El nombre no puede ir vacío!').run(request);
    await check('correo_usuario').isEmail().withMessage('Formato incorrecto para email!').run(request);
    await check('pass_usuario').isLength({ min: 6 }).withMessage('La contraseña debe ser de al menos 6 caracteres!').run(request);
    await check('pass2_usuario').equals(request.body.pass_usuario).withMessage('Las contraseñas no coinciden!').run(request);

    let resultado = validationResult(request); 
    const { nombre_usuario:nombre, correo_usuario:email, pass_usuario:password } = request.body; 
    
    // Si hay errores en la validación
    if (!resultado.isEmpty()) {
        return response.render('auth/register', {
            pagina: 'Crear Cuenta',
            errores: resultado.array(),
            usuario: {
                nombre,
                email
            },
            csrfToken: request.csrfToken()
        });
    }

    // Verificar si el email ya está registrado
    const existeUsuario = await Usuario.findOne({ where: { email } });
    if (existeUsuario) {
        return response.render('auth/register', {
            pagina: 'Crear Cuenta',
            csrfToken: request.csrfToken(),
            duplicado: `EL EMAIL \"${email}\" YA ESTA ASOCIADO A UNA CUENTA!`,
            usuario: {
                nombre: request.body.nombre_usuario,
                email: request.body.correo_usuario
            },
        });
    }

    // Crear el nuevo usuario en la base de datos
    const usuario = await Usuario.create({
        nombre,
        email,
        password,
        token: generateId()
    });

    // Enviar email de confirmación
    emailRegister({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    });

    // Renderizar mensaje de éxito
    response.render('templates/mensaje', {
        page: 'Cuenta Creada Correctamente',
        message1: "Hemos enviado un correo a: ",
        message2: " para la confirmación de cuenta",
        email: email
    });
};

// Formulario para recuperar contraseña
const formularioPasswordRecovery = (request, response) => {
    response.render('auth/passwordRecovery', {
        pagina: "Recuperar contraseña"
    });
};

// Confirmación de cuenta
const confirm = async (request, response) => {
    const { token } = request.params;
    const userWithToken = await Usuario.findOne({ where: { token } });

    if (!userWithToken) {
        return response.render('auth/confirmAccount', {
            message: "Por favor verifica la liga, ya que el token no existe/caducó. Si aún no puedes acceder puedes restaurar tu cuenta en el siguiente enlace:",
            error: true,
            page: "Error de verificación",
            link: `${process.env.BACKEND_DOMAIN}:${process.env.BACKEND_PORT}/usuario/passwordRecovery`
        });
    }

    // Confirmar la cuenta
    userWithToken.token = null;
    userWithToken.confirmado = true;
    await userWithToken.save();

    // Mostrar mensaje de éxito
    response.render('auth/confirmAccount', {
        page: 'Cuenta Confirmada',
        message: "La cuenta se ha confirmado de manera exitosa!",
        link: `${process.env.BACKEND_DOMAIN}:${process.env.BACKEND_PORT}/usuario/passwordRecovery`
    });
};

export { formularioLogin, formularioRegister, createNewUser, formularioPasswordRecovery, confirm };
