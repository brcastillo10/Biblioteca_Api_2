// src/app.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));


const mongoURI = 'mongodb://localhost:27017/registro';
mongoose.connect(mongoURI);

//Lo añadimos

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Conectado a MongoDB');
});

// Usar las rutas de usuario
app.use('/', userRoutes);


app.listen(port, () => {
    console.log(`Server Corriendo en http://localhost:${port}/`);
});

module.exports = app;
