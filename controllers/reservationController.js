import pool from "../libs/db_connection";


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

