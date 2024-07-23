// src/routes/userRoutes.js
const express = require('express');
const User = require('../models/User');
const router = express.Router();
const controller = require("../controllers/main.controller");
const bcrypt = require('bcrypt');
const path = require('path');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/auth');
const saltRound = 10; // Número de rondas de encriptación para bcrypt
const jwtSecret = 'hola-richar-key';

// Ruta para la vista principal
router.get('/', controller.index);

// Ruta para login
router.post("/login", controller.login);

// Ruta para la página de inicio
router.get('/home', (req, res) => {
    res.sendFile(path.resolve(__dirname, "../views/home.html"));
});

// Ruta para la vista de registro
router.get('/registerview', (req, res) => {
    res.sendFile(path.resolve(__dirname, "../../public/register.html"));
});

// Ruta auth para obtener información del usuario
router.get('/user-info', authMiddleware, controller.getUserInfo);
router.post('/toggle-2fa', authMiddleware, controller.toggle2FA);

// Rutas para 2FA
router.post('/setup-2fa', controller.setup2FA);
router.post('/verify-2fa', controller.verify2FA);

// Ruta para registrar usuario
router.post('/register', async (req, res) => {
    try {
        const { nombre, edad, correo, ciudad, contrasena } = req.body;

        // Encriptar Contraseña
        const hashContra = await bcrypt.hash(contrasena, saltRound);

        const nuevoUsuario = new User({ nombre, edad, correo, ciudad, contrasena: hashContra });
        const guardarUsuario = await nuevoUsuario.save();
        res.status(200).send(guardarUsuario);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

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
