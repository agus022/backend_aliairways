import pool from '../libs/db_connection.js';


export const getAllAircrafts = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM aircraft');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en la consulta');
    }
}