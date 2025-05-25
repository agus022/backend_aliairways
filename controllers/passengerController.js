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