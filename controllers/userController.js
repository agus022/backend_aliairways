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
    const { email, password } = req.body;

    try {
        const result = await pool.query(`
            SELECT u.user_id, u.username, u.password, r.name AS role
            FROM user_airways u
            JOIN role r ON u.role_id = r.role_id
            WHERE u.email = $1
        `, [email]);

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
                isAdmin: user.role === 'administrator',
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


export const getUsers = async (req,res) =>{
    try {
        const result = await pool.query('SELECT * FROM user_airways');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en la consulta');
    }
};
export const getProfile =async (req,res)=>{
     
    try {
        const { id } = req.params;
        const result = await pool.query(`SELECT
  u.user_id,
  u.username,
  u.photo,
  u.email AS user_email,
  u.phone AS user_phone,
  u.role_id,
  p.passenger_id,
  p.first_name,
  p.last_name_paternal,
  p.last_name_maternal,
  p.birth_date,
  p.passport,
  p.phone AS passenger_phone,
  p.email AS passenger_email,
  p.accumulated_flights,
  p.frequent_flyer
FROM
  user_airways u
JOIN
  passenger p ON u.user_id =$1 order by p.passenger_id`,[id]);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en la consulta');
    }
}