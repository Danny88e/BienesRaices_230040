import { check, validationResult } from 'express-validator'
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
    await check('nombre').notEmpty().withMessage('El nombre no puede ir vacio').run(request)
    await check('email').isEmail().withMessage('Formato incorrecto para email').run(request)
    await check('password').isLength({min: 6}).withMessage('La contraseña debe ser de al menos 6 caracteres').run(request)
    await check('password','Las contraseñas no coinciden!').equals(request.body.passConfirm).run(request)
    let resultado = validationResult(request)
    //Validación
    if (!resultado.isEmpty()){
        return response.render('auth/register.pug', {
            pagina: 'Crear Cuenta',
            errores: resultado.array()
        })
        /*response.json(resultado.array())
        response.json(resultado.array())
        const usuario = await Usuario.create(request.body)
        response.json(usuario)*/
    } 
    const usuario = await Usuario.create(request.body)

}

const formularioPasswordRecovery = (request, response) => 
    response.render('auth/passwordRecovery',{
    pagina: "Recuperar contraseña"
})

export{formularioLogin, formularioRegister, formularioRegistrar, formularioPasswordRecovery}