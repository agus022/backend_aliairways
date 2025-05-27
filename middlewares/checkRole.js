export function checkRole(allowedRoles = []) {
    return (req, res, next) => {
        console.log('REQ.AUTH:', req.auth);
        const userRole = req.auth?.role;

        if (!userRole || !allowedRoles.includes(userRole)) {
            return res.status(403).json({ message: 'Acceso denegado: rol insuficiente' });
        }

        next();
    };
}