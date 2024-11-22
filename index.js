// Ejemplo de activación de HOT RELOAD
// npm i -D nodemon
// agregar a package.json 


import express from 'express';
import csrf from 'csurf'
import cookieParser from 'cookie-parser'
import generalRoutes from './routes/generalRoutes.js';
import userRoutes from './routes/userRoutes.js';
import db from './db/db.js';

// Crear la app
const app = express(); 

// Habilitar Cookie Parser
app.use(cookieParser())

// Habilitar CSRF
app.use(csrf({cookie:true}))

// Conexión a la BD
try {
    await db.authenticate();
    db.sync()
    console.log("Conexión exitosa a la base de datos.")
} catch (error) {
    console.log(error)
}

// Habilitar Pug
app.set('view engine','pug')
app.set('views','./views')

// Definir la carpeta pública de recursos estáticos (assets)

app.use(express.static('public'))

// Habilitar lectura de datos de formularios 

app.use(express.urlencoded({extended:true}))

// COnfiguramos nuestro servidor web
const port = 3000;
app.listen(port, ()=>{
    console.log(`La aplicación ha iniciado en el puerto: ${port}`);
});

// Routing - Enrutamiento para peticiones
app.use('/',generalRoutes);
app.use('/usuario',userRoutes);