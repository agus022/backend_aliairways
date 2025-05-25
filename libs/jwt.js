import { expressjwt as jwt } from 'express-jwt';

function authJwt() {
    const secret = process.env.SECRET;
    const api = process.env.API_PREFIX;

    return jwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({
        path: [
            { url: /\/api\/v1\/flights\/(.*)/, methods: ['GET'] },
            `${api}/airports`,
            `${api}/users/login`,
            `${api}/users/register`
        ]
    });
}

async function isRevoked(req, token) {
    if (!token.payload.isAdmin) {
        return false; // Revoca el token si no es admin
    }
}

export default authJwt;
