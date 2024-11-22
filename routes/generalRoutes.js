import express from 'express';

const router = express.Router();

router.get("/", function(req,res){
    res.redirect('/usuario/login')
})

router.get("/quienEres", function(req,res){
    res.json(
        {
            "nombre":"Luis Daniel Suarez Escamilla",
            "carrera":"TI DSM",
            "grado":"4°",
            "grupo":"A"
        }
    )
});

export default router; // Esta palabra reservada de JS me permite exportar los elementos