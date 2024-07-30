// src/server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const libroRutes = require('./routes/libroRoutes');
const app = express();
const path = require('path'); 
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

const mongoURI = 'mongodb://localhost:27017/registro';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

/* Middleware para manejar errores 404
app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, '/views/404.html'));
});
*/
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Conectado a MongoDB');
});

// Usar las rutas de usuario
app.use('/', userRoutes);
// Usar para las rutas de los Libros
app.use('/', libroRutes);

app.listen(port, () => {
    console.log(`Server Corriendo en http://localhost:${port}`);
});

module.exports = app;