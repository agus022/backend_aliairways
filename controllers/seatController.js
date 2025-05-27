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
    console.log("HOLA");
    try {
        const { aircraft_id,id } = req.params;
        const result = await pool.query('SELECT * FROM seat WHERE aircraft_id=$2 and seat_id = $1', [aircraft_id,id]);
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

//obtener todos los asientos por avion
export const getSeatsByAircraft = async (req, res) => {
  console.log("Aircraft",req.params.flight_id);
  try {
    const { aircraft_id } = req.params;
    const result = await pool.query(
      'SELECT * FROM seat WHERE aircraft_id = $1 ORDER BY seat_id',
      [aircraft_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los asientos de la aeronave');
  }
};


//obtener asientos libres por avion 
export const getAvailableSeats = async (req, res) => {
  try {
    const { aircraft_id } = req.params;
    const result = await pool.query(
      'SELECT * FROM seat WHERE aircraft_id = $1 AND available = TRUE',
      [aircraft_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los asientos disponibles');
  }
};

//contar asientos ocupados y asientos libres por avion , talvez se pueda separar en dos metodos para obtener libres y otro para obtener ocupados 
export const getSeatAvailabilityStats = async (req, res) => {
  try {
    const { aircraft_id } = req.params;
    const result = await pool.query(`
      SELECT
        COUNT(*) FILTER (WHERE available = TRUE) AS available,
        COUNT(*) FILTER (WHERE available = FALSE) AS occupied
      FROM seat
      WHERE aircraft_id = $1
    `, [aircraft_id]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener estadísticas de asientos');
  }
};

//filtrar asientos por clase 
export const getSeatsByClass = async (req, res) => {
  try {
    const { aircraft_id, seat_class } = req.params;
    const result = await pool.query(
      'SELECT * FROM seat WHERE aircraft_id = $1 AND class = $2',
      [aircraft_id, seat_class]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los asientos por clase');
  }
};
export const getSeatsByFlight = async (req, res) => {
  console.log("BUSCANDO ASIENTOS");
  try {
    const { flight_id } = req.params;
    console.log(flight_id);
    const result = await pool.query(
      `select s.aircraft_id,s.seat_id,s.class,s.position,s.cost,s.available
  from flight f join aircraft a on f.aircraft_id=a.aircraft_id
  join seat s on s.aircraft_id=a.aircraft_id
  where flight_id=$1`,
      [flight_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los asientos por clase');
  }
};
export const updateSeatsByReservation = async (req, res) => {
  try {
    const { reservation_id } = req.params;
    const {aircraft_id,seat_id} =req.body;
    const result = await pool.query(
      `update reservation set aircraft_id=$1, seat_id=$2 where reservation_id=$3;`,
      [aircraft_id,seat_id,reservation_id]
    );
    res.json({ message: 'Asiento actualizado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los asientos por clase');
  }
};