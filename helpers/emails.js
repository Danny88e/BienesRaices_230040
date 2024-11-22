import nodemailer from 'nodemailer'

const emailRegister = async (data) =>{
    var transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  const {email, nombre, token    } = data
  // Enviar al email
  await transport.sendMail({
    from: 'BienesRaices.com',
    to: email,
    subject: 'Confirma tu cuenta en BienesRaices.com',
    text: 'Confirma tu Cuenta en BienesRaices.com',
    html: `
        <p> Hola ${nombre}, comprueba tu cuenta en bienesRaices.com</p>

        <p>Tu cuenta ya esta lista, solo debes confirmarla en el siguiente enlace:
        <a href="">Confirmar tu Cuenta</a> </p>

        <p> Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
    `
  })
}

export {
    emailRegister
}