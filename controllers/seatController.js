import pool from '../libs/db_connection.js';


export const getSeats = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM seat');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en la consulta');
    }
}
export const getSeatById = async (req, res) => {
    try {
        const { aircraft_id,id } = req.params;
        const result = await pool.query('SELECT * FROM seat WHERE aircradt_id=$2 and seat_id = $1', [aircraft_id,id]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en la consulta');
    }
}
export const addSeat = async (req, res) => {
    try {
        const { aircraft_id,seat_id, type,position,cost,available } = req.body;

        await pool.query(
            `INSERT INTO seat (
                aircraft_id,seat_id, class, position, cost, available
            ) VALUES ($1,$2,$3,$4,$5,$6)`,
            [aircraft_id, seat_id, type, position, cost, available]
        );

        res.status(201).json({ message: 'Asiento creado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en la consulta');
    }
}
export const updateSeat = async (req, res) => {
    try {
        const { aircraft_id,id } = req.params;
        const {type, position, cost, available } = req.body;

        await pool.query(
            `UPDATE seat SET
             class = $1, position = $2,
                cost = $3, available = $4
            WHERE aircraft_id=$5 and seat_id = $6`,
            [type, position, cost, available,aircraft_id, id]
        );

        res.json({ message: 'Asiento actualizado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en la consulta');
    }
}
export const deleteSeat = async (req, res) => {
    try {
        const { aircraft_id,id } = req.params;

        await pool.query('DELETE FROM seat WHERE aircraft_id=$1 and seat_id = $2 ', [aircraft_id,id]);

        res.json({ message: 'Asiento eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en la consulta');
    }
}