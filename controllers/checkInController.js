import pool from '../libs/db_connection.js';


 export const getCheckIn = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(`SELECT * FROM checkIn WHERE reservation_id = $1`, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Avión no encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener el avión');
    }
};

export const getDataFromCheckIn = async(req,res) => {
    console.log("hola");
    try{
        const {id_reservation,last_name} = req.body;
        console.log("BoDY",req.body);
        const result = await pool.query(`select r.reservation_id,f.flight_id,a.model,f.departure_time,f.arrival_time,

       f.origin_id,f.destination_id,f.departure_date,
       (select s.class from seat  s where s.aircraft_id=a.aircraft_id  and s.seat_id=r.seat_id) as class,
       (select concat(s.position,'',s.seat_id) from seat  s where s.aircraft_id=a.aircraft_id  and s.seat_id=r.seat_id) as seat,
       concat(p.first_name,' ',p.last_name_paternal,' ',p.last_name_maternal) as full_name,
       p.email,
       p.phone,
       (select c.estado from checkIn c where c.reservation_id=r.reservation_id)
from reservation r
    join passenger p on r.passenger_id=p.passenger_id
    join flight f on f.flight_id=r.flight_id
    join aircraft a on a.aircraft_id=f.aircraft_id
    where r.reservation_id=$1 and concat(p.last_name_paternal,' ',p.last_name_maternal)=$2;
`,[id_reservation,last_name]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Reservacion no encontrada' });
        }

        res.json(result.rows[0]);
    }catch(error){
        console.error(error);
        res.status(500).send('Error al obtener datos de la reservacion')
    };
}
export const createChekIn =async(req,res)=>{
    try{
        const {reservation_id,estado,pase_codigo}=req.body;
        const result= await pool.query(`insert into checkIn 
             (reservation_id,estado,pase_codigo) values ($1,$2,$3);
`,[reservation_id,estado,pase_codigo]);
res.status(201).json({ message: 'Pasajero creado correctamente' });
    }catch{
        console.error(error);
        res.status(500).send('Error al insertar el checkIn')
    };
}