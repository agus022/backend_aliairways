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

export const getAircraftById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM aircraft WHERE aircraft_id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Avión no encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener el avión');
    }
};


export const createAircraft = async (req, res) => {
    try {
        const { model, capacity} = req.body;

        await pool.query(
            'INSERT INTO aircraft (model, capacity) VALUES ($1, $2)',
            [model, capacity]
        );

        res.status(201).json({ message: 'Avión creado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al crear el avión');
    }
};


export const updateAircraft = async (req, res) => {
    try {
        const { id } = req.params;
        const { model, capacity} = req.body;

        const result = await pool.query(
            'UPDATE aircraft SET model = $1, capacity = $2 WHERE aircraft_id = $3',
            [model, capacity, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Avión no encontrado para actualizar' });
        }

        res.json({ message: 'Avión actualizado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al actualizar el avión');
    }
};


export const deleteAircraft = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query('DELETE FROM aircraft WHERE aircraft_id = $1', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Avión no encontrado para eliminar' });
        }

        res.json({ message: 'Avión eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al eliminar el avión');
    }
};

// Buscar aviones por modelo
export const searchAircraftByModel = async (req, res) => {
    try {
        const { model } = req.params;

        const result = await pool.query(
            'SELECT * FROM aircraft WHERE LOWER(model) LIKE LOWER($1)',
            [`%${model}%`]
        );

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al buscar aviones por modelo');
    }
};

// Obtener el número total de aviones
export const getAircraftCount = async (req, res) => {
    try {
        const result = await pool.query('SELECT COUNT(*) FROM aircraft');
        res.json({ count: parseInt(result.rows[0].count, 10) });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al contar los aviones');
    }
};