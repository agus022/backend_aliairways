import pool from '../libs/db_connection.js';

export const getPassengers = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM passenger');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en la consulta');
    }
}
export const getPassengerById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM passenger WHERE passenger_id = $1', [id]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en la consulta');
    }
}
export const addPassenger = async (req, res) => {
    try {
        const { first_name,last_name_maternal,last_name_paternal,birth_date,passport,phone,email,accumulated_flights,frecuent_flyer,user_id } = req.body;

        await pool.query(
            `INSERT INTO passenger (
                first_name, last_name_maternal, last_name_paternal, birth_date, passport, phone, email, accumulated_flights, frecuent_flyer, user_id
            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
            [first_name, last_name_maternal, last_name_paternal, birth_date, passport, phone, email, accumulated_flights, frecuent_flyer, user_id]

        );
        res.status(201).json({ message: 'Pasajero creado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en la consulta');
    }
}
export const deletePasanger = async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query('DELETE FROM passenger WHERE passenger_id = $1', [id]);

        res.json({ message: 'Pasajero eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en la consulta');
    }
}
export const updatePassenger = async (req, res) => {
    try {
        const { id } = req.params;
        const { first_name,last_name_maternal,last_name_paternal,birth_date,passport,phone,email,accumulated_flights,frecuent_flyer,user_id } = req.body;

        await pool.query(
            `UPDATE passenger SET
                first_name = $1, last_name_maternal = $2, last_name_paternal = $3,
                birth_date = $4, passport = $5, phone = $6, email = $7,
                accumulated_flights = $8, frequent_flyer = $9, user_id = $10
            WHERE passenger_id = $11`,
            [first_name, last_name_maternal, last_name_paternal, birth_date, passport, phone, email, accumulated_flights, frecuent_flyer, user_id,id]
        );

        res.json({ message: 'Pasajero actualizado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en la consulta');
    }
}

// buscar cliente por nombre o pasaporte 
export const searchPassengers = async (req, res) => {
    try {
        const { search } = req.query;
        const result = await pool.query(`
            SELECT * FROM passenger 
            WHERE LOWER(first_name) LIKE LOWER($1) 
               OR LOWER(last_name_paternal) LIKE LOWER($1) 
               OR LOWER(passport) LIKE LOWER($1)
        `, [`%${search}%`]);

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al buscar pasajeros');
    }
};
export const getHistorial=async(req,res)=>{
    try{
        const{id}=req.params;
        const result=await pool.query(`select p.accumulated_flights, sum(pa.transaction_amount)
  from user_airways u join passenger p on p.user_id=u.user_id
  join reservation r on r.passenger_id=p.passenger_id
  join payment pa on pa.payment_id=r.payment_id
  where u.user_id=$1
  group by 1
  ;`,[id]);
        res.json(result.rows);
    }catch(error){
        console.error(error);
        res.status.send('Error al obtener historial');
    }
}

export const getFlights=async(req,res)=>{
    try{
        const{id}=req.params;
        const result=await pool.query(`
            SELECT 
  f.flight_id,
  f.status,
  (SELECT city FROM airport a WHERE a.airport_id = f.origin_id) AS origin,
  (SELECT city FROM airport a WHERE a.airport_id = f.destination_id) AS destination,
  f.departure_date,
  f.arrival_date,
  f.departure_time,
  f.arrival_time,
  -- Duración en formato legible
  CONCAT(
    CASE WHEN EXTRACT(day FROM (f.arrival_date + f.arrival_time - (f.departure_date + f.departure_time))) > 0 
         THEN EXTRACT(day FROM (f.arrival_date + f.arrival_time - (f.departure_date + f.departure_time))) || 'd ' 
         ELSE '' 
    END,
    EXTRACT(hour FROM (f.arrival_date + f.arrival_time - (f.departure_date + f.departure_time))) || 'h ',
    EXTRACT(minute FROM (f.arrival_date + f.arrival_time - (f.departure_date + f.departure_time))) || 'm ',
    FLOOR(EXTRACT(second FROM (f.arrival_date + f.arrival_time - (f.departure_date + f.departure_time)))) || 's'
  ) AS formatted_duration,
  f.cost,
  ai.model,
  r.reservation_id
FROM user_airways u
JOIN passenger p ON p.user_id = u.user_id
JOIN reservation r ON r.passenger_id = p.passenger_id
JOIN flight f ON f.flight_id = r.flight_id
JOIN aircraft ai ON ai.aircraft_id = f.aircraft_id
WHERE u.user_id = $1;  `,[id]);
            res.json(result.rows);
    }catch(error){
        console.error(error);
        res.status(500).send('Error al buscar vuelos');
    }

}


// Obtener estadísticas de pasajeros 
export const getPassengerStats = async (req, res) => {
  const { range } = req.query;

  let currentStart = "CURRENT_DATE";
  let previousStart = "CURRENT_DATE - INTERVAL '1 day'";
  let previousEnd = "CURRENT_DATE";

  if (range === 'week') {
    currentStart = "CURRENT_DATE - INTERVAL '7 days'";
    previousStart = "CURRENT_DATE - INTERVAL '14 days'";
    previousEnd = "CURRENT_DATE - INTERVAL '7 days'";
  } else if (range === 'month') {
    currentStart = "CURRENT_DATE - INTERVAL '1 month'";
    previousStart = "CURRENT_DATE - INTERVAL '2 months'";
    previousEnd = "CURRENT_DATE - INTERVAL '1 month'";
  }

  try {
    // Pasajeros transportados actualmente
    const currentPassengers = await pool.query(`
      SELECT COUNT(*)::int AS total
      FROM reservation r
      JOIN flight f ON r.flight_id = f.flight_id
      WHERE f.departure_date >= ${currentStart}
    `);

    const previousPassengers = await pool.query(`
      SELECT COUNT(*)::int AS total
      FROM reservation r
      JOIN flight f ON r.flight_id = f.flight_id
      WHERE f.departure_date >= ${previousStart}
        AND f.departure_date < ${previousEnd}
    `);

    // Factor de carga actual
    const loadFactorCurrent = await pool.query(`
      SELECT 
        SUM(1)::int AS seats_reserved,
        SUM(ac.capacity)::int AS total_seats
      FROM reservation r
      JOIN flight f ON r.flight_id = f.flight_id
      JOIN aircraft ac ON f.aircraft_id = ac.aircraft_id
      WHERE f.departure_date >= ${currentStart}
    `);

    const loadFactorPrevious = await pool.query(`
      SELECT 
        SUM(1)::int AS seats_reserved,
        SUM(ac.capacity)::int AS total_seats
      FROM reservation r
      JOIN flight f ON r.flight_id = f.flight_id
      JOIN aircraft ac ON f.aircraft_id = ac.aircraft_id
      WHERE f.departure_date >= ${previousStart}
        AND f.departure_date < ${previousEnd}
    `);

    const totalCurrent = currentPassengers.rows[0].total || 1;
    const totalPrevious = previousPassengers.rows[0].total || 1;

    const seatsCurrent = loadFactorCurrent.rows[0];
    const seatsPrevious = loadFactorPrevious.rows[0];

    const currentFactor = seatsCurrent.total_seats
      ? (seatsCurrent.seats_reserved / seatsCurrent.total_seats) * 100
      : 0;

    const previousFactor = seatsPrevious.total_seats
      ? (seatsPrevious.seats_reserved / seatsPrevious.total_seats) * 100
      : 0;

    res.json({
      passenger_count: totalCurrent,
      passenger_growth_pct: Math.round(((totalCurrent - totalPrevious) / totalPrevious) * 100),
      avg_load_factor: Number(currentFactor.toFixed(1)),
      load_factor_growth_pct: Math.round(currentFactor - previousFactor)
    });

  } catch (error) {
    console.error(error);
    res.status(500).send('Error al calcular estadísticas de pasajeros');
  }
};

//obtener los pasaje mediante clases de asiento al que pertenece
export const getPassengerCountByClass = async (req, res) => {
  const { range } = req.query;

  let startDate = "CURRENT_DATE";
  if (range === "week") startDate = "CURRENT_DATE - INTERVAL '7 days'";
  else if (range === "month") startDate = "CURRENT_DATE - INTERVAL '1 month'";

  try {
    const result = await pool.query(`
      SELECT s.class, COUNT(*) AS count
      FROM reservation r
      JOIN flight f ON r.flight_id = f.flight_id
      JOIN seat s ON r.seat_id = s.seat_id AND f.aircraft_id = s.aircraft_id
      WHERE f.departure_date >= ${startDate}
      GROUP BY s.class
    `);

    const response = {
      Economica: 0,
      Ejecutiva: 0,
      Primera: 0,
    };

    result.rows.forEach(row => {
      const clase = row.class?.toLowerCase();
      if (clase.includes('econ')) response.Economica += Number(row.count);
      else if (clase.includes('ejec')) response.Ejecutiva += Number(row.count);
      else if (clase.includes('prim')) response.Primera += Number(row.count);
    });

    res.json(response);
  } catch (error) {
    console.error('Error al obtener pasajeros por clase:', error);
    res.status(500).send('Error en la consulta');
  }
};


export const getPassengerCount = async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) AS total FROM passenger');
    res.json({ total: parseInt(result.rows[0].total) });
  } catch (error) {
    console.error('Error al obtener el total de pasajeros:', error);
    res.status(500).send('Error al obtener el total de pasajeros');
  }
};