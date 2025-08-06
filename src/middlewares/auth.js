const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function(req, res, next) {
  // Obtener token desde Authorization o x-auth-token
  const authHeader = req.header('Authorization');
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : req.header('x-auth-token'); // fallback

  // Si no hay token, rechazar
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');

    // Verificar si el usuario sigue existiendo
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User no longer exists' });
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token error:', err.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};
