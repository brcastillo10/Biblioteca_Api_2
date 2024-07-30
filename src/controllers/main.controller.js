// src/controllers/main.controller.js
const path = require("path");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

const jwtSecret = 'hola-richar-key';

const index = (req, res) => {
    res.sendFile(path.resolve(__dirname, "../../public/login.html"));
};

const getUserInfo = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).select('nombre correo edad ciudad'); // Obtiene el nombre y correo del usuario

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json({ nombre: user.nombre, correo: user.correo, ciudad: user.ciudad, edad: user.edad});
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los datos del usuario', error });
    }
};

const toggle2FA = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const action = req.query.action;

        if (action === 'enable' && !user.twoFactorEnabled) {
            const secret = speakeasy.generateSecret({ name: "BibliotecaApp" });
            user.twoFactorSecret = secret.base32;
            user.twoFactorEnabled = true;
        } else if (action === 'disable' && user.twoFactorEnabled) {
            user.twoFactorSecret = undefined;
            user.twoFactorEnabled = false;
        }

        await user.save();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const setup2FA = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const secret = speakeasy.generateSecret({ name: "BibliotecaApp" });
        user.twoFactorSecret = secret.base32;
        await user.save();

        QRCode.toDataURL(secret.otpauth_url, (err, data_url) => {
            res.json({ secret: secret.base32, qr: data_url });
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const verify2FA = async (req, res) => {
    try {
        const { userId, token } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token: token
        });

        if (verified) {
            user.twoFactorEnabled = true;
            await user.save();
            res.json({ success: true });
        } else {
            res.status(400).json({ error: 'Código inválido' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const login = async (req, res) => {
    try {
        const { correo, contrasena, twoFactorToken } = req.body;
        const user = await User.findOne({ correo });
        if (!user) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }

        const match = await bcrypt.compare(contrasena, user.contrasena);
        if (!match) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        if (user.twoFactorEnabled) {
            if (!twoFactorToken) {
                return res.status(400).json({ error: 'Se requiere código 2FA', require2FA: true });
            }
            const verified = speakeasy.totp.verify({
                secret: user.twoFactorSecret,
                encoding: 'base32',
                token: twoFactorToken
            });
            if (!verified) {
                return res.status(401).json({ error: 'Código 2FA inválido' });
            }
        }

        const token = jwt.sign({ id: user._id, correo: user.correo }, jwtSecret, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//Verificar el role
const checkRole = (roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return res.status(403).send('Acceso denegado');
    }
    next();
};

module.exports = { index, login, setup2FA, verify2FA, getUserInfo, toggle2FA, checkRole };
