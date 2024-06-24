const mongoose = require('mongoose');

//Schema para los libros en mongoDB
const libroSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    editorial: { type: String, required: true },
    fechaDePublicacion: { type: Date, required: true },
    autores: { type: [String], required: true }, // Array de strings para múltiples autores
    genero: { type: String, required: true },
    resumen: { type: String, required: true }
});


const Libros = mongoose.model('Libros', libroSchema);

module.exports = Libros;