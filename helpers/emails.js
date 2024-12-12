import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config({ path: '.env' })

const emailRegister = async (data) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const { email, nombre, token } = data;

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
        <title>Confirmación de Cuenta</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f9;
            margin: 0;
            padding: 0;
            color: #333;
          }
          .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            background-color: #5C3E93;
            color: white;
            padding: 30px;
            border-radius: 8px;
          }
          .header h1 {
            font-family: 'Optima', sans-serif;
            font-weight: bold;
            margin: 0;
          }
          .content {
            padding: 20px;
            text-align: center;
            color: #555;
          }
          .content p {
            font-size: 16px;
            line-height: 1.6;
          }
          .btn {
            background-color: #5C3E93;
            color: white;
            padding: 15px 30px;
            font-size: 18px;
            border: none;
            border-radius: 5px;
            text-decoration: none;
            display: inline-block;
            margin-top: 20px;
            text-align: center;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 14px;
            color: gray;
          }
          .footer a {
            color: #5C3E93;
            text-decoration: none;
            margin: 0 10px;
          }
          .footer a:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Bienes Raices</h1>
          </div>
          <div class="content">
            <h2>¡Hola, ${nombre}!</h2>
            <p>Gracias por registrarte en <strong>Bienes Raices</strong>, tu plataforma de confianza para encontrar la propiedad de tus sueños.</p>
            <p>Para completar tu proceso de registro, necesitamos que verifiques tu cuenta. La verificación es un paso importante para asegurarnos de que tus datos son correctos y para poder ofrecerte el mejor servicio posible.</p>
            <p>Haz clic en el siguiente botón para confirmar tu cuenta. Una vez lo hagas, podrás acceder a todas las funcionalidades de nuestra plataforma y comenzar a explorar opciones de bienes raíces.</p>
            <a href="${process.env.BACKEND_DOMAIN}:${process.env.BACKEND_PORT}/auth/confirmAccount/${token}" class="btn">Confirmar Cuenta</a>
            <p>Si no te registraste en nuestro sitio web o crees que este correo es un error, por favor ignóralo. No te preocupes, no se hará ningún cambio en tu cuenta.</p>
          </div>
          <div style="text-align:center">
            <p><strong>Atentamente,</strong></p>
            <p><strong>Luis Daniel Suarez Escamilla</strong></p>
          </div>
          <div class="footer">
            <p style="margin-top: 20px;">Firma:</p>
            <p>&copy; 2024 Bienes Raices 23004. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `
  })
}

const emailChangePassword = async (data) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const { email, nombre, token } = data;

  // Enviar al email
  await transport.sendMail({
    from: 'BienesRaices.com',
    to: email,
    subject: 'Restauracion tu cuenta en BienesRaices.com',
    text: 'Restaura tu Cuenta en BienesRaices.com',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Restauracion de Cuenta</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f9;
            margin: 0;
            padding: 0;
            color: #333;
          }
          .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            background-color: #5C3E93;
            color: white;
            padding: 30px;
            border-radius: 8px;
          }
          .header h1 {
            font-family: 'Optima', sans-serif;
            font-weight: bold;
            margin: 0;
          }
          .content {
            padding: 20px;
            text-align: center;
            color: #555;
          }
          .content p {
            font-size: 16px;
            line-height: 1.6;
          }
          .btn {
            background-color: #5C3E93;
            color: white;
            padding: 15px 30px;
            font-size: 18px;
            border: none;
            border-radius: 5px;
            text-decoration: none;
            display: inline-block;
            margin-top: 20px;
            text-align: center;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 14px;
            color: gray;
          }
          .footer a {
            color: #5C3E93;
            text-decoration: none;
            margin: 0 10px;
          }
          .footer a:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Bienes Raices</h1>
          </div>
        <div class="content">
          <h2>¡Hola, ${nombre}!</h2>
          <p>Hemos recibido una solicitud para restaurar tu contraseña en <strong>Bienes Raices</strong>, tu plataforma de confianza para encontrar la propiedad de tus sueños.</p>
          <p>Para proceder con la restauración de tu contraseña, necesitamos que verifiques tu identidad. Este paso es esencial para asegurarnos de que solo tú puedas cambiar tu contraseña y mantener la seguridad de tu cuenta.</p>
          <p>Haz clic en el siguiente botón para restablecer tu contraseña. Una vez lo hagas, podrás crear una nueva contraseña y continuar disfrutando de todos los servicios de nuestra plataforma.</p>
          <a href="${process.env.BACKEND_DOMAIN}:${process.env.BACKEND_PORT}/auth/passwordRecovery/${token}" class="btn">Restaurar Contraseña</a>
          <p>Si no solicitaste la restauración de tu contraseña o crees que este correo es un error, por favor ignóralo. No te preocupes, no se hará ningún cambio en tu cuenta.</p>
        </div>

          <div style="text-align:center">
            <p><strong>Atentamente,</strong></p>
            <p><strong>Luis Daniel Suarez Escamilla</strong></p>
          </div>
          <div class="footer">
            <p style="margin-top: 20px;">Firma:</p>
            <p>&copy; 2024 Bienes Raices 23004. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `
  })
}


export { emailRegister, emailChangePassword }
