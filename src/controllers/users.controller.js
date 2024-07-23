const User = require("../models/User");
const bcrypt = require('bcrypt');
const path = require('path');
const saltRound = 10; //Se hace una variable para el algoritmo de encriptcion en la cual sirve para saber las veces que se repetira el algoritmo para que sepa cuantas veces lo tiene que encriptar

const getUsers = async (req, res)=>{
    try {
        const users = await User.find();
        res.status(200).send(users);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const registerUsers = async (req, res)=>{
    try {
        const { nombre, edad, correo, ciudad, contrasena } = req.body;

        //Encriptar Contraseña
        const hashContra = await bcrypt.hash(contrasena, saltRound)

        const nuevoUsuario = new User({ nombre, edad, correo, ciudad, contrasena: hashContra, role: 'user' });
        const guardarUsuario = await nuevoUsuario.save();
        res.status(200).send(guardarUsuario);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const deleteUsers = async (req, res)=>{
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
};

const UpdateUsers = async (req, res)=>{
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
};

module.exports = { getUsers, deleteUsers, registerUsers, UpdateUsers };
