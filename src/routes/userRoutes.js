// src/routes/userRoutes.js
const express = require('express');
const User = require('../models/User');
const router = express.Router();
const controller = require("../controllers/main.controller");
const UserController = require("../controllers/users.controller");
const app = require('../server');
//Paquete para generar token
const path = require('path');

// Ruta para la vista
router.get('/', controller.index);

router.post("/login", controller.login);

router.get('/registerview', (req, res) => {
    /* res.sendFile(path.join(__dirname, '../views/home.html')); */
    res.sendFile(path.resolve(__dirname, "../../public/register.html"));
});

//Ruta de los usuarios
router.get('/users', UserController.getUsers);

router.post('/register', UserController.registerUsers);

router.delete('/users/:userId',UserController.deleteUsers);

router.put('/users/:userId', UserController.UpdateUsers);

module.exports = router;