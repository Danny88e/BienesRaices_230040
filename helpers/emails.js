import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config({path: '.env'})

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
        <!DOCTYPE html>
<html>
<head>
<title>HTML CSS JS</title>
</head>
<style>
  h1 {
    font-family: Optima, sans-serif;
    font-weight: bold;
  }
  #user {
    font-family: font-family: system-ui;
  }
  #title {
    display: flex;
    justify-content: center;
    display: block;
    flex-direction: row;
    background-color: #5C3E93;
    padding: 40;
    border-radius: 40px;
    margin: 20;
    box-shadow: 0px 5px 20px 0.1px black;
  }
  #title_content {
    text-align: center;
    color: #F5F2FB;
  }
  #content {
    background-color: #C8B7E9;
    border-radius: 40px;
    padding-bottom: 15;
    padding:10;
  }
  #welcome_message {
    display: flex;
    justify-content: center;
    font-size:30px
  }
  #lower_message {
    background-color: #F7F2FF;
    border-radius: 50px;
    padding: 25px;
    font-family: Verdana, sans-serif;
  } 
  #instructions {
    font-size:20px
  }
</style>
<body>
<div id="content">
  <div id="title">
    <h1 id="title_content" style="flex-shrink:0">Bienes Raices</h1>
    <img href="/public/images/real-estate.png">
  </div>
  <div id="lower_message">
    <h1 style="flex-shrink:0">Email de verificación</h1>
    <div id="welcome_message">
      <p id="welcome0" style="flex-shrink:1">¡Te damos la bienvenida a Bienes Raices <span style="font-weight: bold">${nombre}</span>!</p>
    </div>
    <p id="instructions">Para continuar, solo verificar tu cuenta solo da click en el siguiente enlace:</p>
    <a href="${process.env.BACKEND_DOMAIN}:${process.env.BACKEND_PORT}/usuario/confirmAccount/${token}" style="display:flex; justify-content: center;">Confirmar Cuenta</a>
    <p>Si tu no te registraste a esta página, ignora este correo.</p>
  </div>
  <div id="signature" style="background-color: white; border-radius: 20px; margin-top: 20px; margin-bottom: 20px; text-align: center;">
	  <p style="color: gray"> © Bienes Raices XJ. Derechos Reservados</p>
	  <div>
		<a href="#">Visítanos</a>
		<a href="#">Contacto</a>
		<a href="#">Términos y Condiciones</a>
        <a href="#">Acerca de Nosotros</a>
	  </div>
  </div>
</div>
</body>
</html>
    `
  })
}

export {
    emailRegister
}