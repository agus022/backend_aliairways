import jwt from 'jsonwebtoken';

export function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Token faltante' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.auth = decoded;  // ← AQUÍ es donde se llena req.auth
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
}
