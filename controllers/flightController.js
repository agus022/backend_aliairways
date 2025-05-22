import pool from '../libs/db_connection.js';

export const getFlightFull=async (req,res) =>{
    const { origin, destination, departureDate } = req.query
 try{
    const result= await pool.query(
        `
        SELECT
            f.flight_id AS id,
            'Ali Airways' AS airline,
            '/images/logo/logo-2.svg' AS airlineLogo,
            CONCAT('AA', f.flight_id) AS flightNumber,
            TO_CHAR(f.departure_date + f.departure_time, 'YYYY-MM-DD"T"HH24:MI:SS') AS departureTime,
            TO_CHAR(f.arrival_date + f.arrival_time, 'YYYY-MM-DD"T"HH24:MI:SS') AS arrivalTime,
            ao.code AS departureAirport,
            ad.code AS arrivalAirport,
            ao.city AS departureCity,
            ad.city AS arrivalCity,
            f.cost AS price,
            300 AS taxes,
            'MXN' AS currency,
            EXTRACT(EPOCH FROM ((f.arrival_date + f.arrival_time) - (f.departure_date + f.departure_time))) / 60 AS durationMinutes,
            CASE
            WHEN f.location ILIKE '%direct%' THEN 0
            WHEN f.location ILIKE '%1 escala%' THEN 1
            ELSE 1
            END AS stops,
            ac.model AS aircraft,
            ac.capacity - (
            SELECT COUNT(*)
            FROM reservation r
            WHERE r.flight_id = f.flight_id
            ) AS availableSeats
        FROM flight f
        JOIN airport ao ON f.origin_id = ao.airport_id
        JOIN airport ad ON f.destination_id = ad.airport_id
        JOIN aircraft ac ON f.aircraft_id = ac.aircraft_id
        WHERE ao.city = $1 AND ad.city = $2 AND f.departure_date = $3;
        `,
    [origin, destination,departureDate]
    );
    res.json(result.rows);
}catch(error){
    console.error(error);
    res.status(500).send('Error en la cosunta');
}
}
export const getAllFlights = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM flight');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en la consulta');
    }
}
export const getFlightByOriginAndDestination=async (req, res) => {
    try {
        const origin = req.params.origin || null;
        const destination = req.params.destination || null;
    
        const result = await pool.query(
          `
          SELECT 
            f.flight_id,
            f.departure_date,
            f.arrival_date,
            f.departure_time,
            f.arrival_time,
            ao.city AS origin_city,
            ad.city AS destination_city,
            f.status,
            f.cost
          FROM flight f
          JOIN airport ao ON f.origin_id = ao.airport_id
          JOIN airport ad ON f.destination_id = ad.airport_id
          WHERE 
            ($1::text IS NULL OR LOWER(ao.city) LIKE LOWER('%' || $1 || '%')) AND
            ($2::text IS NULL OR LOWER(ad.city) LIKE LOWER('%' || $2 || '%'))
          `,
          [origin, destination]
        );
    
        res.json({ data: result.rows });
      } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los vuelos');
      }
};
export const getFlightByOriginAndDestinationAndDate=async (req, res) => {
    try {
        const origin = req.params.origin || null;
        const destination = req.params.destination || null;
        const date = req.params.date || null;
    
        const result = await pool.query(
          `
          SELECT 
            f.flight_id,
            f.departure_date,
            f.arrival_date,
            f.departure_time,
            f.arrival_time,
            ao.city AS origin_city,
            ad.city AS destination_city,
            f.status,
            f.cost
          FROM flight f
          JOIN airport ao ON f.origin_id = ao.airport_id
          JOIN airport ad ON f.destination_id = ad.airport_id
          WHERE 
            ($1::text IS NULL OR LOWER(ao.city) LIKE LOWER('%' || $1 || '%')) AND
            ($2::text IS NULL OR LOWER(ad.city) LIKE LOWER('%' || $2 || '%')) AND
            ($3::date IS NULL OR f.departure_date = $3)
          `,
          [origin, destination, date]
        );
    
        res.json({ data: result.rows });
      } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los vuelos');
      }
};

export const getFlightById=async (req, res) => {
    try {
        const id = req.params.id;
        const result = await pool.query('SELECT * FROM flight WHERE flight_id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).send('Vuelo no encontrado');
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en la consulta');
    }
}
export const createFlight=async (req, res) => {
    try {
        const {aircraft_id, departure_date, arrival_date, departure_time, arrival_time, origin_id, destination_id, status, cost,location } = req.body;
        const result = await pool.query(
            'INSERT INTO flight (aircraft_id,departure_date, arrival_date, departure_time, arrival_time, origin_id, destination_id, status, cost,location) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9,$10) RETURNING *',
            [aircraft_id,departure_date, arrival_date, departure_time, arrival_time, origin_id, destination_id, status, cost, location]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al crear el vuelo');
    }
}
export const updateFlight=async (req, res) => {
    try {
        const id = req.params.id;
        const { departure_date, arrival_date, departure_time, arrival_time, origin_id, destination_id, status, cost } = req.body;
        const result = await pool.query(
            'UPDATE flight SET departure_date = $1, arrival_date = $2, departure_time = $3, arrival_time = $4, origin_id = $5, destination_id = $6, status = $7, cost = $8 WHERE flight_id = $9 RETURNING *',
            [departure_date, arrival_date, departure_time, arrival_time, origin_id, destination_id, status, cost, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).send('Vuelo no encontrado');
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al actualizar el vuelo');
    }
}
export const deleteFlight=async (req, res) => {
    try {
        const id = req.params.id;
        const result = await pool.query('DELETE FROM flight WHERE flight_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).send('Vuelo no encontrado');
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al eliminar el vuelo');
    }
}


// obtener vuelos por status
export const getFlightsByStatus = async (req, res) => {
    try {
        const { status } = req.params;
        const result = await pool.query(
            'SELECT * FROM flight WHERE LOWER(status) = LOWER($1)',
            [status]
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener vuelos por estado');
    }
};


