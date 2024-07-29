const express = require('express');
const Libros = require('../models/libros');
const { models } = require('mongoose');
const router = express.Router();
const LibroController = require('../controllers/libros.controller')
const authMiddleware = require('../middleware/auth');
const path = require('path');
const { checkRole} = require('../controllers/main.controller'); //requerimos las funciones de verificar token y checkar el rol

//Ruta para las vistas


router.post("/dashboard", LibroController.registrarLibro);

router.get('/home', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../views/home.html'));
});

router.get('/libros', LibroController.getLibro);

router.post('/libros', LibroController.PostLibro);

router.delete('/libros/:id',LibroController.deletLibro);

router.put('/libros/:id', LibroController.updateLibro)


module.exports = router;

/*
{
    "titulo": "Cien Años de Soledad",
    "editorial": "Editorial Sudamericana",
    "fechaDePublicacion": "1967-06-05",
    "autores": ["Gabriel Garcia Marquez"],
    "genero": "Realismo mágico",
    "resumen": "La historia de la familia Buendía en el pueblo de Macondo..."
}


 */