// main.controller.js

const path = require("path");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const jwtSecret = 'hola-richar-key';

const index = (req, res) => {
    res.sendFile(path.resolve(__dirname, "../../public/login.html"));
};

const login = async (req, res) => {
    try {
        const { correo, contrasena } = req.body;
        const user = await User.findOne({ correo });
        if (!user) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }

        const match = await bcrypt.compare(contrasena, user.contrasena);
        if (!match) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        const token = jwt.sign({ id: user._id, correo: user.correo, role: user.role }, jwtSecret, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/*
const login = async (req, res) => {
    try {
        const { correo, contrasena } = req.body;
       // console.log('antes', req.body) //Esto se muestra en la consola
        // Buscar el usuario por correo
        const user = await User.findOne({ correo });
        if (!user) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }

        // Comparar la contraseña
        const match = await bcrypt.compare(contrasena, user.contrasena);
        if (!match) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }
       // console.log('antes', req.body) //Esto se muestra en la consola
        // Generar un token JWT
        const token = jwt.sign({ id: user._id, correo: user.correo }, jwtSecret, { expiresIn: '1h' });
        res.status(200).json({ token });
        // Después de recibir el token del servidor
    
        res.redirect('/home');

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
*/
//middleware

const verificarToken = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
        return res.status(401).send('Acceso denegado');
    }
    try {
        const verified = jwt.verify(token, jwtSecret);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Token inválido');
    }
};

//Verificar el role
const checkRole = (roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return res.status(403).send('Acceso denegado');
    }
    next();
};

module.exports = { index, login, verificarToken, checkRole };
