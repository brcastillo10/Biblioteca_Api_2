//Usamos bcrypt para poder encriptar la contraseña


// src/models/User.js
const mongoose = require('mongoose');


//Actualizamos el modelo de usuario para agregar la contraseña
const userSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    edad: { type: Number, required: true, min: 0 },
    correo: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
    ciudad: { type: String, required: true },
    contrasena:{type: String, required: true},
    role: { type: String, enum: ['admin', 'user'], default:'user'} //Campo que dara el rol pordefecto de usuario si se quiere crear un rol de admin cambiar 'user' por 'admin'
});

const User = mongoose.model('User', userSchema);

module.exports = User;
