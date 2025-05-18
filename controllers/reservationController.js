import pool from "../libs/db_connection";


export const getAllReservations = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM reservation');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al obtener reservaciones");
    }
};

export const getReservationById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM reservation WHERE reservation_id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Reservación no encontrada" });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al obtener la reservación");
    }
};



export const createReservation = async (req, res) => {
    try {
        const { flight_id, aircraft_id, seat_id, passenger_id, payment_id, date } = req.body;
        const result = await pool.query(`
            INSERT INTO reservation (flight_id, aircraft_id, seat_id, passenger_id, payment_id, date)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `, [flight_id, aircraft_id, seat_id, passenger_id, payment_id, date]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al crear la reservación");
    }
};


export const updateReservation = async (req, res) => {
    try {
        const { id } = req.params;
        const { flight_id, aircraft_id, seat_id, passenger_id, payment_id, date } = req.body;
        const result = await pool.query(`
            UPDATE reservation
            SET flight_id = $1, aircraft_id = $2, seat_id = $3, passenger_id = $4, payment_id = $5, date = $6
            WHERE reservation_id = $7
            RETURNING *
        `, [flight_id, aircraft_id, seat_id, passenger_id, payment_id, date, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Reservación no encontrada" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al actualizar la reservación");
    }
};


export const deleteReservation = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM reservation WHERE reservation_id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Reservación no encontrada" });
        }

        res.json({ message: "Reservación eliminada correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al eliminar la reservación");
    }
};


//obtiene todos los pasajeros de un vuelo, en su respectivo asiento
export const getPassagersByIdFlight = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(`
select p.first_name,p.last_name_paternal,p.last_name_maternal,p.email,age(current_date,p.birth_date) as age,s.position as seat,s.cost as cost_seat,s.class as class  from  reservation r
    join passenger p on r.passenger_id=p.passenger_id join seat s on s.aircraft_id=r.aircraft_id and  s.seat_id=r.seat_id where r.flight_id=$1);
        `, [id]);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error en la consulta");
    }
}

//obtener reservaciones por pasajero 
export const getReservationsByPassenger = async (req, res) => {
    try {
        const { passenger_id } = req.params;
        const result = await pool.query('SELECT * FROM reservation WHERE passenger_id = $1', [passenger_id]);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al obtener reservaciones del pasajero");
    }
};


//verificar si el asiento ya esta reservado en el vuelo 
export const isSeatTaken = async (req, res) => {
    try {
        const { flight_id, seat_id } = req.query;
        const result = await pool.query(`
            SELECT COUNT(*) FROM reservation 
            WHERE flight_id = $1 AND seat_id = $2
        `, [flight_id, seat_id]);

        const taken = parseInt(result.rows[0].count, 10) > 0;
        res.json({ taken });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al verificar asiento");
    }
};


