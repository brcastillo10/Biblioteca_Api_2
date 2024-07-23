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

const getLibro = async (req, res) =>{
    try {
        const libro = await Libros.find();
        res.status(200).send(libro);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const PostLibro = async (req, res) => {
    try {
        const { titulo, editorial, fechaDePublicacion, autores, genero, resumen } = req.body;
        const nuevoLibro = new Libros({ titulo, editorial, fechaDePublicacion, autores, genero, resumen });
        const guardarlibro = await nuevoLibro.save();
        res.status(200).send(guardarlibro);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const deletLibro = async (req, res) => {
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
};

const updateLibro = async (req, res) => {
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
}

module.exports = { getLibro, registrarLibro, PostLibro, deletLibro, updateLibro };
