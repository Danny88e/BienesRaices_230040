import { check, validationResult } from 'express-validator'
import { generarId } from '../helpers/token.js'
import Usuario from "../models/Usuario.js"

const formularioLogin = (request, response) => 
    response.render('auth/login',{
    pagina: "Inicia sesión"
})

const formularioRegister = (request, response) => 
    response.render('auth/register',{
    pagina: "Crea tu cuenta"
})

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
    } else { 
        await Usuario.create({
            nombre,
            email,
            password,
            token: generarId()
        })
        /*return response.render('auth/register.pug',{
            pagina: 'Crear Cuenta',
            mensaje: 'Cuenta creada!'
        })*/
       response.render('templates/mensaje',{
            page: 'Cuenta Creada Correctamente',
            mensaje: 'Se ha enviado un email de confirmación'
       })
    }
}

const formularioPasswordRecovery = (request, response) => 
    response.render('auth/passwordRecovery',{
    pagina: "Recuperar contraseña"
})

export{formularioLogin, formularioRegister, formularioRegistrar, formularioPasswordRecovery}