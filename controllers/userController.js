import { check, validationResult } from 'express-validator';
import { generateId } from '../helpers/token.js';
import Usuario from "../models/Usuario.js";
import { emailRegister } from '../helpers/emails.js';
import { emailChangePassword } from '../helpers/emails.js';


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

// Validación de la edad: debe ser mayor de 18 años
const validarEdad = (fechaNacimiento) => {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    const edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();

    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
        return edad - 1;
    }
    return edad;
};

const createNewUser = async (request, response) => {
    // Validación de campos
    await check('nombre_usuario').notEmpty().withMessage('El nombre no puede ir vacío!').run(request);
    await check('correo_usuario').isEmail().withMessage('Formato incorrecto para email!').run(request);
    await check('pass_usuario').isLength({ min: 6 }).withMessage('La contraseña debe ser de al menos 6 caracteres!').run(request);
    await check('pass2_usuario').equals(request.body.pass_usuario).withMessage('Las contraseñas no coinciden!').run(request);
    await check('fecha_nacimiento').isDate().withMessage('Fecha de nacimiento inválida!').run(request); // Validar fecha de nacimiento

    let resultado = validationResult(request); 
    const { nombre_usuario:nombre, correo_usuario:email, pass_usuario:password, fecha_nacimiento } = request.body; 
    
    // Validar si el usuario es mayor de edad
    const edad = validarEdad(fecha_nacimiento);
    if (edad < 18) {
        resultado.errors.push({ msg: 'Debes ser mayor de 18 años para registrarte.' });
    }

    // Si hay errores en la validación
    if (!resultado.isEmpty()) {
        return response.render('auth/register', {
            pagina: 'Crear Cuenta',
            errores: resultado.array(),
            usuario: {
                nombre,
                email,
                fecha_nacimiento
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
                email: request.body.correo_usuario,
                fecha_nacimiento: request.body.fecha_nacimiento
            },
        });
    }

    // Crear el nuevo usuario en la base de datos
    const usuario = await Usuario.create({
        nombre,
        email,
        password,
        fecha_nacimiento, // Guardar la fecha de nacimiento
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
        pagina: "Recuperar contraseña",
        csrfToken : request.csrfToken()
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
            link: `${process.env.BACKEND_DOMAIN}:${process.env.BACKEND_PORT}/auth/passwordRecovery`
            
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
        link: `${process.env.BACKEND_DOMAIN}:${process.env.BACKEND_PORT}/auth/passwordRecovery`
    });
};

const verifyTokenPassword = async (request,response)=>{
const {token} = request.params;
const userTokenOwner = await Usuario.findOne({where: {token}})
if (!userTokenOwner){
response.render('templates/mensaje',{
    page: 'Error',
    message1: "El token ha expirado o no existe"
})
}
// Mostrar un formulario para modificar el password
response.render('auth/reset-password',{
    page: "Restauración de contraseña",
    csrfToken: request.csrfToken()
    })
}
const updatePassword = async (request,response) =>{
    const {token} = request.params;
    //Validar campos de contraseñas
    await check('new_password').notEmpty().withMessage("La contraseña es un campo obligatorio").isLength({min:8}).withMessage("La contraseña debe ser de al menos 8 carácteres").run(request)
    await check('confirm_new_password').equals(request.body.new_password).withMessage("La contraseña y su confirmación deben coincidir").run(request)
    let result = validationResult(request)
    if(!result.isEmpty()){
        return response.render("auth/reset-password", {
            page: 'Error al intentar crear la Cuenta de Usuario',
            errors: result.array(),
            csrfToken: request.csrfToken()
        })
    }
    //Actualiazr la BD en pass
    const userTokenOwner = await Usuario.findOne({where:{token}})
        userTokenOwner.password=request.body.new_password
        userTokenOwner.token=null
        userTokenOwner.save()
        return response.render("auth/confirmAccount",{
            page: 'Contraseña cambiada exitosamente',
            message: "La contraseña ha sido aactualizada",
            link: `${process.env.BACKEND_DOMAIN}:${process.env.BACKEND_PORT}/auth/login`
        })
};

const passwordReset = async (request, response) =>{
    console.log("Validando los datos para la recuperación de la contraseña")
    // Validación de los campos que se reciben del formulario
    // Validación frontend (await)
    await check('email').notEmpty().withMessage("El correo electrónico es un campo obligatorio.").run(request)
    await check('email').isEmail().withMessage("El correo electrónico no tiene el formato de: usuario@dominio.extension").run(request)
    let result = validationResult(request)

    // Verificamos si hay errores de validación
    if (!result.isEmpty()){
        return response.render("auth/passwordRecovery",{
            page : "Error al intentar resetear la contraseña",
            errores: result.array(),
            csrfToken: request.csrfToken()
        })
    }
    
    // Desestructurar los parámetros del request
    const {email} = request.body

    // Validación de BACKEND
    // Verificar que el usuario no existe previamente en la bd
    const existingUser = await Usuario.findOne({where: {email, confirmado:1}})

    if (!existingUser)
    {
        return response.render("auth/passwordRecovery",{
            page: "Error, no existe una cuenta autentificada asociada al correo electrónico ingresado",
            csrfToken: request.csrfToken(),
            errores: result.array(),
            usuario: {
                email
            }
        })
    }
        // Registramos los datos en la base de datos.
        existingUser.password=" ";
        existingUser.token = generateId();
        existingUser.save();
        // Enviar el correo de confirmación
        emailChangePassword({
            email: existingUser.email,
            nombre: existingUser.nombre,
            token: existingUser.token
        })
        response.render('templates/mensaje',{
            page: 'Correo de solicitud de restauración de contraseña',
            message1: "Hemos enviado un correo a: ",
            message2: " para la restauración de la contraseña de la cuenta",
            email: email,
            csrfToken: request.csrfToken()
        })
}

export { formularioLogin, formularioRegister, createNewUser, formularioPasswordRecovery, verifyTokenPassword, updatePassword, passwordReset, confirm };
