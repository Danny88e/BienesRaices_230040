import { check, validationResult } from 'express-validator'
import { generateId } from '../helpers/token.js'
import Usuario from "../models/Usuario.js"
import { emailRegister } from '../helpers/emails.js'
import dotenv from 'dotenv'
import req from 'express/lib/request.js'
import { response } from 'express'
dotenv.config({path: '.env'})

const formularioLogin = (request, response) => 
    response.render('auth/login',{
    pagina: "Inicia sesión"
})

const formularioRegister = (request, response) => 
    console.log(request.csrfToken())
    response.render('auth/register',{
        pagina: "Crea tu cuenta"
    }
)

const formularioRegistrar = async (request, response) => {
    // Validación
    await check('nombre').notEmpty().withMessage('El nombre no puede ir vacio!').run(request)
    await check('email').isEmail().withMessage('Formato incorrecto para email!').run(request)
    await check('password').isLength({min: 6}).withMessage('La contraseña debe ser de al menos 6 caracteres!').run(request)
    await check('password').equals(request.body.passConfirm).withMessage('Las contraseñas no coinciden!').run(request)
    let resultado = validationResult(request)
    const { nombre,email,password } = request.body 
    // Verificar usuario no duplicado
    const existeUsuario = await Usuario.findOne({where : {email}})
    if (existeUsuario){
        return response.render('auth/register.pug', {
            pagina: 'Crear Cuenta',
            duplicado: `EL EMAIL \"${email}\" YA ESTA ASOCIADO A UNA CUENTA!`,
            usuario : {
                nombre,
                email
            }
        })
    }
    //Validación
    if (!resultado.isEmpty()){
        return response.render('auth/register.pug', {
            pagina: 'Crear Cuenta',
            errores: resultado.array(),
            usuario : {
                nombre,
                email
            }
        })
        /*response.json(resultado.array())
        response.json(resultado.array())
        const usuario = await Usuario.create(request.body)
        response.json(usuario)*/
    } 
    const usuario = await Usuario.create({
        nombre,
        email,
        password,
        token: generateId()
    })
    // Envia email de confirmación
    emailRegister({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    })
    /*return response.render('auth/register.pug',{
    pagina: 'Crear Cuenta',
    mensaje: 'Cuenta creada!'
    })*/
    response.render('templates/mensaje',{
        page: 'Cuenta Creada Correctamente',
        message1: "Hemos enviado un correo a: ",
        message2: " para la confirmación de cuenta",
        email: email
    })
    
}

const formularioPasswordRecovery = (request, response) => 
    response.render('auth/passwordRecovery',{
    pagina: "Recuperar contraseña"
})

const confirm = async (request, response) =>
    {
        const {token} = request.params
        const userWithToken = await Usuario.findOne({where:{token}})

        if(!userWithToken){
                response.render('auth/confirmAccount',{
                    message: "Porfavor verifica la liga, ya que el token no existe/caduco. Si aún no puedes acceder puedes restaurar tu cuenta en el siguiente enlace:",
                    error: true,
                    page: "Error de verificación",  
                    link: `${process.env.BACKEND_DOMAIN}:${process.env.BACKEND_PORT}/usuario/passwordRecovery`
            })
        } else {
            userWithToken.token = null;
            userWithToken.confirmado = true;
            await userWithToken.save();
        }
        response.render('auth/confirmAccount',{
            page: 'Cuenta Confirmada',
            message: "La cuenta se ha confirmado de manera exitosa!",
            link: `${process.env.BACKEND_DOMAIN}:${process.env.BACKEND_PORT}/usuario/passwordRecovery`
        })
        
    }

export{formularioLogin, formularioRegister, formularioRegistrar, formularioPasswordRecovery, confirm}