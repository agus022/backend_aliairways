import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import pool from '../libs/db_connection.js';

const SECRET = process.env.SECRET;

//REGISTRO DE USUARIO
export const register = async (req, res) => {
    try {
        const { username, password, email, phone, role_id } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `INSERT INTO user_airways (username, password, email, phone, role_id)
             VALUES ($1, $2, $3, $4, $5) RETURNING user_id, username, email, phone`,
            [username, hashedPassword, email, phone, role_id]
        );

        res.status(201).json({
            message: 'Usuario registrado correctamente',
            user: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al registrar usuario');
    }
};

//LOGIN DE USUARIO
export const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await pool.query(`
            SELECT u.user_id, u.username, u.password, r.name AS role
            FROM user_airways u
            JOIN role r ON u.role_id = r.role_id
            WHERE u.username = $1
        `, [username]);

        if (result.rows.length === 0) {
            return res.status(401).send('Usuario no encontrado');
        }

        const user = result.rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).send('Contraseña incorrecta');
        }

        const token = jwt.sign(
            {
                userId: user.user_id,
                username: user.username,
                isAdmin: user.role === 'admin',
                role: user.role
            },
            SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: 'Login exitoso',
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al autenticar');
    }
};
