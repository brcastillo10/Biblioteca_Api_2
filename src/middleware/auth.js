const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No hay token, autorización denegada' });
  }

  try {
    const decoded = jwt.verify(token, 'hola-richar-key');
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token no es válido' });
  }
};