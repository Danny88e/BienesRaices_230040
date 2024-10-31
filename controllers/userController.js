
const formularioLogin = (request, response) => 
    response.render('auth/login',{
    autenticado: true
})

const formularioRegister = (request, response) => 
    response.render('auth/register',{
    autenticado: true
})


const formularioPasswordRecovery = (request, response) => 
    response.render('auth/passwordRecovery',{
    autenticado: true
})

export{formularioLogin, formularioRegister, formularioPasswordRecovery}