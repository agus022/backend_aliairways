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

export const getAirportById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM airport WHERE airport_id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Aeropuerto no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener el aeropuerto');
  }
};

export const createAirport = async (req, res) => {
  try {
    const { name, city, code } = req.body;
    await pool.query(
      'INSERT INTO airport (name, city, code) VALUES ($1, $2, $3)',
      [name, city, code]
    );

    res.status(201).json({ message: 'Aeropuerto creado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al crear el aeropuerto');
  }
};

export const updateAirport = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, city, code } = req.body;

    await pool.query(
      'UPDATE airport SET name = $1, city = $2, code = $3 WHERE airport_id = $4',
      [name, city, code, id]
    );

    res.json({ message: 'Aeropuerto actualizado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al actualizar el aeropuerto');
  }
};

export const deleteAirport = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM airport WHERE airport_id = $1', [id]);

    res.json({ message: 'Aeropuerto eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al eliminar el aeropuerto');
  }
};


export const getAirportByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const result = await pool.query('SELECT * FROM airport WHERE LOWER(code) = LOWER($1)', [code]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Código de aeropuerto no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al buscar por código');
  }
};


export const getAirportsByCity = async (req, res) => {
  try {
    const { city } = req.params;
    const result = await pool.query('SELECT * FROM airport WHERE LOWER(city) = LOWER($1)', [city]);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al buscar aeropuertos por ciudad');
  }
};


//se puede usar para el dashboard 
export const getAirportCountByCity = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT city, COUNT(*) AS total FROM airport GROUP BY city ORDER BY total DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al contar aeropuertos por ciudad');
  }
};