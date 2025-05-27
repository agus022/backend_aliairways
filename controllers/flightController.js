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


// primer KPIS para los vuelos total,pendiente, cancelados 
export const getFlightKPIs = async (req, res) => {
  const { range } = req.query;

  let intervalCurrent = 'CURRENT_DATE';
  let intervalPrevious = 'CURRENT_DATE - INTERVAL \'1 day\'';

  if (range === 'week') {
    intervalCurrent = "CURRENT_DATE - INTERVAL '7 days'";
    intervalPrevious = "CURRENT_DATE - INTERVAL '14 days'";
  } else if (range === 'month') {
    intervalCurrent = "CURRENT_DATE - INTERVAL '1 month'";
    intervalPrevious = "CURRENT_DATE - INTERVAL '2 months'";
  }

  try {
    const current = await pool.query(`
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE status ILIKE '%completado%')::int AS completed,
        COUNT(*) FILTER (WHERE status ILIKE '%pendiente%')::int AS pending,
        COUNT(*) FILTER (WHERE status ILIKE '%cancelado%')::int AS cancelled
      FROM flight
      WHERE departure_date >= ${intervalCurrent}
    `);

    const previous = await pool.query(`
      SELECT COUNT(*)::int AS total
      FROM flight
      WHERE departure_date >= ${intervalPrevious} AND departure_date < ${intervalCurrent}
    `);

    const totalCurrent = current.rows[0].total || 1;
    const totalPrev = previous.rows[0].total || 1;

    res.json({
      total_flights: totalCurrent,
      completed_pct: Math.round((current.rows[0].completed / totalCurrent) * 100),
      pending_pct: Math.round((current.rows[0].pending / totalCurrent) * 100),
      cancelled_pct: Math.round((current.rows[0].cancelled / totalCurrent) * 100),
      growth_vs_previous: Math.round(((totalCurrent - totalPrev) / totalPrev) * 100)
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al calcular los KPIs de vuelos');
  }
};

//vuelos en curso
export const getCurrentFlightsStatus = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        COUNT(*) FILTER (WHERE arrival_date = CURRENT_DATE)::int AS arrivals,
        COUNT(*) FILTER (WHERE departure_date = CURRENT_DATE)::int AS departures
      FROM flight;
    `);

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener vuelos en curso');
  }
};

//total de vuelos registrados 
export const getAllCountFlights = async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) AS total FROM flight');
    res.json({ total: result.rows[0].total });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en la consulta');
  }
};

//geenerar grafica de vuelos totales por tiempo dias,semanas y meses 
export const getFlightTotalsOverTime = async (req, res) => {
  const { range } = req.query;
  let groupBy, dateCondition;

  if (range === 'day') {
    groupBy = "TO_CHAR(departure_date, 'YYYY-MM-DD')";
    dateCondition = "departure_date >= CURRENT_DATE - INTERVAL '7 days'";
  } else if (range === 'week') {
    groupBy = "TO_CHAR(date_trunc('week', departure_date), 'YYYY-MM-DD')";
    dateCondition = "departure_date >= CURRENT_DATE - INTERVAL '1 month'";
  } else {
    groupBy = "TO_CHAR(date_trunc('month', departure_date), 'YYYY-MM')";
    dateCondition = "departure_date >= CURRENT_DATE - INTERVAL '1 year'";
  }

  try {
    const result = await pool.query(`
      SELECT ${groupBy} AS label, COUNT(*) AS total
      FROM flight
      WHERE ${dateCondition}
      GROUP BY label
      ORDER BY label
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener totales de vuelos');
  }
};

//datos fianancieros de los vuelos
export const getFinancialSummary = async (req, res) => {
  const { range } = req.query;

  let startDate = 'CURRENT_DATE';
  if (range === 'week') {
    startDate = "CURRENT_DATE - INTERVAL '7 days'";
  } else if (range === 'month') {
    startDate = "CURRENT_DATE - INTERVAL '1 month'";
  }

  try {
    const incomeQuery = `
      SELECT COALESCE(SUM(transaction_amount), 0)::int AS total_income
      FROM payment
      WHERE date >= ${startDate};
    `;

    const payrollQuery = `
      SELECT COALESCE(SUM(net_salary), 0)::int AS employee_expenses
      FROM payroll
      WHERE date_issued >= ${startDate};
    `;

    const [incomeResult, payrollResult] = await Promise.all([
      pool.query(incomeQuery),
      pool.query(payrollQuery),
    ]);

    const total_income = incomeResult.rows[0].total_income;
    const employee_expenses = payrollResult.rows[0].employee_expenses;

    // 🔧 Combustible y mantenimiento simulado (puedes conectar a una tabla futura)
    const maintenance_fuel_expenses = 500000;

    const total_expenses = employee_expenses + maintenance_fuel_expenses;

    res.json({
      total_income,
      total_expenses,
      employee_expenses,
      maintenance_fuel_expenses,
    });
  } catch (error) {
    console.error('Error en getFinancialSummary:', error);
    res.status(500).send('Error al obtener resumen financiero');
  }
};


///Obtener todos los vuelos de un empleado now

export const getFlightByEmployeNow=async (req,res) =>{
    const { id } = req.params;
    try{
        const result= await pool.query(
            `
            select f.flight_id,f.status,a.aircraft_id,
          (select concat(ai.code,' ',ai.city)  from airport ai where ai.airport_id=f.origin_id) as origen,
          (select concat(ai.code,' ',ai.city)  from airport ai where ai.airport_id=f.origin_id) as destino,
          f.departure_time,f.arrival_time,a.model,
          (select count(*) from reservation r join checkIn c on r.reservation_id=c.reservation_id
                            where r.flight_id=f.flight_id) as num_passanger
        from flight f
        join aircraft a on f.aircraft_id=a.aircraft_id
        join flight_employee fe on fe.flight_id=f.flight_id
        join employee e on e.employee_id=fe.employee_id
        join user_airways ua on ua.user_id=e.user_id
        where e.user_id=$1 and f.departure_date=current_date
        order by f.departure_date,f.departure_time;
                    `,
        [id]
        );
        res.json(result.rows);
    }catch(error){
        console.error(error);
        res.status(500).send('Error en la cosunta');
    }
}

// Obtener todos los vuelos de un empleado despues de hoy
export const getFlightByEmployePosterior=async (req,res) =>{
    const { id } = req.params;
    try{
        const result= await pool.query(
            `
           select f.flight_id,f.status,a.aircraft_id,
       (select concat(ai.code,' ',ai.city)  from airport ai where ai.airport_id=f.origin_id) as origen,
       (select concat(ai.code,' ',ai.city)  from airport ai where ai.airport_id=f.origin_id) as destino,
       f.departure_time,f.arrival_time,a.model,
       (select count(*) from reservation r join checkIn c on r.reservation_id=c.reservation_id
                        where r.flight_id=f.flight_id) as num_passanger
    from flight f
    join aircraft a on f.aircraft_id=a.aircraft_id
    join flight_employee fe on fe.flight_id=f.flight_id
    join employee e on e.employee_id=fe.employee_id
    join user_airways ua on ua.user_id=e.user_id
    where e.user_id=$1 and f.departure_date>current_date
    order by f.departure_date,f.departure_time;
                    `,
        [id]
        );
        res.json(result.rows);
    }catch(error){
        console.error(error);
        res.status(500).send('Error en la cosunta');
    }
}

