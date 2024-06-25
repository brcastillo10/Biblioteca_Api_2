const express = require('express');
const Libros = require('../models/libros');
const { models } = require('mongoose');
const router = express.Router();
const LibroController = require('../controllers/libros.controller')
const path = require('path');

//Ruta para las vistas


router.post("/dashboard", LibroController.registrarLibro);

router.get('/home', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../views/home.html'));
});


// Ruta para obtener todos los libros en POSTMAN
router.get('/libros', async (req, res) => {
    try {
        const libro = await Libros.find();
        res.status(200).send(libro);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

//Ruta para registrar libros
router.post('/libros', async (req,res)=>{
    try {
        const { titulo, editorial, fechaDePublicacion, autores, genero, resumen } = req.body;
        const nuevoLibro = new Libros({ titulo, editorial, fechaDePublicacion, autores, genero, resumen });
        const guardarlibro = await nuevoLibro.save();
        res.status(200).send(guardarlibro);
    } catch (err) {
        res.status(500).send(err.message);
    }
});


// Ruta para eliminar un libro por su ID
router.delete('/libros/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deletedlibro = await Libros.findByIdAndDelete(id);
        if (!deletedlibro) {
            return res.status(404).send("Libro no encontrado");
        }
        res.status(200).send("El lirbo fue eliminado correctamente");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Ruta para actualizar un libro por su ID
router.put('/libros/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { titulo, editorial, fechaDePublicacion, autores, genero, resumen } = req.body;

        const updatedlibros = await Libros.findByIdAndUpdate(id, { titulo, editorial, fechaDePublicacion, autores, genero, resumen }, { new: true });
        if (!updatedlibros) {
            return res.status(404).send("Libro no encontrado");
        }
        res.status(200).send(updatedlibros);
    } catch (err) {
        res.status(500).send(err.message);
    }
});



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