const path = require("path");
const Libros = require("../models/libros");



const registrarLibro = async (req, res) => {
    try {
        const { titulo, editorial, fechaDePublicacion, autores, genero, resumen } = req.body;
        const nuevoLibro = new Libros({ titulo, editorial, fechaDePublicacion, autores, genero, resumen });
        const guardarlibro = await nuevoLibro.save();
        res.status(200).send(guardarlibro);
    } catch (err) {
        res.status(500).send(err.message);
    }
};


module.exports = { registrarLibro };