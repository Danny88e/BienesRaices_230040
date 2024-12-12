const admin = (request,response) => {
    response.render('propiedades/admin', {
        pagina: 'Mis Propiedades'
    })
}

export {
    admin
}