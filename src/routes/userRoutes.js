// src/routes/userRoutes.js
const express = require('express');
const User = require('../models/User');
const router = express.Router();
const controller = require("../controllers/main.controller");
//Agregamos bcrypt
const bcrypt = require('bcrypt');
const app = require('../server');
const saltRound = 10; //Se hace una variable para el algoritmo de encriptcion en la cual sirve para saber las veces que se repetira el algoritmo para que sepa cuantas veces lo tiene que encriptar
//Paquete para generar token
const jwt = require('jsonwebtoken');
const path = require('path');
const jwtSecret = 'hola-richar-key';

// Ruta para la vista
router.get('/', controller.index);

router.post("/login", controller.login);

router.get('/home', (req, res) => {
    /* res.sendFile(path.join(__dirname, '../views/home.html')); */
    res.sendFile(path.resolve(__dirname, "../views/home.html"));
});

router.get('/registerview', (req, res) => {
    /* res.sendFile(path.join(__dirname, '../views/home.html')); */
    res.sendFile(path.resolve(__dirname, "../../public/register.html"));
});


// Ruta para registrar usuario
router.post('/register', async (req, res) => {
    try {
        const { nombre, edad, correo, ciudad, contrasena } = req.body;

        //Encriptar Contraseña
        const hashContra = await bcrypt.hash(contrasena, saltRound)

        const nuevoUsuario = new User({ nombre, edad, correo, ciudad, contrasena: hashContra });
        const guardarUsuario = await nuevoUsuario.save();
        res.status(200).send(guardarUsuario);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

//Ruta para el Login
/* router.post('/login', async (req, res) => {
    try {
        const { correo, contrasena } = req.body;

        //Buscar el usuario por correo
        const user = await User.findOne({ correo });
        if (!user) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }

        //Comparar la contraseña
        const match = await bcrypt.compare(contrasena, user.contrasena);
        if (!match) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        //Generar un token JWT
        const token = jwt.sign({ id: user._id, correo: user.correo }, jwtSecret, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}); */



// Ruta para eliminar un usuario por su ID
router.delete('/users/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).send("Usuario no encontrado");
        }
        res.status(200).send("Usuario eliminado correctamente");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Ruta para actualizar un usuario por su ID
router.put('/users/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const { nombre, edad, correo, ciudad } = req.body;

        const updatedUser = await User.findByIdAndUpdate(userId, { nombre, edad, correo, ciudad }, { new: true });
        if (!updatedUser) {
            return res.status(404).send("Usuario no encontrado");
        }
        res.status(200).send(updatedUser);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Ruta para obtener todos los usuarios
router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).send(users);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;
