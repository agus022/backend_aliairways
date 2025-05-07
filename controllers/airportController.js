import pool from '../libs/db_connection.js';


export const getAllAirports = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM airport');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en la consulta');
    }
}