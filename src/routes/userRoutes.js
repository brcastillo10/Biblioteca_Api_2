// src/routes/userRoutes.js
const express = require('express');
const User = require('../models/User');
const router = express.Router();
const controller = require("../controllers/main.controller");
const UserController = require("../controllers/users.controller");
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
router.get('/home', authMiddleware ,(req, res) => {
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

//Ruta de los usuarios
router.get('/users', UserController.getUsers);
router.post('/register', UserController.registerUsers);
router.delete('/users/:userId',UserController.deleteUsers);
router.put('/users/:userId', UserController.UpdateUsers);


module.exports = router;
