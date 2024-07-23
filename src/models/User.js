// src/models/User.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    nombre: { type: String, required: true },
    edad: { type: Number, required: true },
    correo: { type: String, required: true, unique: true },
    ciudad: { type: String, required: true },
    contrasena: { type: String, required: true },
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: { type: String }
});

module.exports = mongoose.model('User', userSchema);
