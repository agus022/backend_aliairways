import pool from '../libs/db_connection.js';

export const getLuggage = async (req,res) =>{
    try {
        const result = await pool.query('SELECT * FROM luggage');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en la consulta para obtener todos los equipajes');
    }
};

export const createLuggage = async (req, res) =>{
    try {
        const {weight, description , price} =req.body;
        await pool.query(
            `INSERT INTO luggage (weight,description,price) VALUES($1,$2,$3)`,
            [weight, description , price]
        );

        res.status(201).json({ message:'Equipaje creado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al crear el equipaje');
        
    }
}

export const updateLuggage = async (req, res) => {
    try {
      const { id } = req.params;
      const { weight, description , price } = req.body;
  
      await pool.query(
        'UPDATE luggage SET name = $1,$2,$3 WHERE luggage_id = $4',
        [weight, description , price, id]
      );
  
      res.json({ message: 'Equiipaje actualizado correctamente' });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al actualizar el equipaje');
    }
};


export const deleteLuggage = async (req, res) => {
    try {
      const { id } = req.params;
  
      await pool.query('DELETE FROM luggage WHERE luggage_id = $1', [id]);
  
      res.json({ message: 'Equipaje eliminado correctamente' });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al eliminar el equipaje');
    }
};

export const getLuggageById = async (req, res) => {
    try {
      const { id } = req.params;
  
      const result = await pool.query('SELECT * FROM luggage WHERE luggage_id = $1', [id]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Equipaje no encontrado' });
      }
  
      res.json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener el equipaje');
    }
};
//Obtener todas las maletas procesadas ese día por empleado
export const getNumLuggageByEmployeeNow = async (req, res) => {
    try {
      
      const { id } = req.params;
  console.log(id);
      const result = await pool.query(`select count(*) as total from flight f join reservation r on f.flight_id = r.flight_id
    join reservation_luggage rl on rl.reservation_id=r.reservation_id
    join flight_employee fe on fe.flight_id=f.flight_id
    join employee e on fe.employee_id=e.employee_id
    join user_airways ua on ua.user_id=e.user_id
    where f.departure_date=CURRENT_DATE and e.user_id=$1;
`, [id]);
      res.json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener el equipaje');
    }
};
//Obtener todas las maletas procesadas con sobrepeso ese día por empleado
export const getNumOverLuggageByEmployeeNow = async (req, res) => {
    try {
      const { id } = req.params;
  
      const result = await pool.query(`select count(*) as total from flight f join reservation r on f.flight_id = r.flight_id
    join reservation_luggage rl on rl.reservation_id=r.reservation_id
    join luggage l on rl.luggage_id=l.luggage_id
    join flight_employee fe on fe.flight_id=f.flight_id
    join employee e on fe.employee_id=e.employee_id
    join user_airways ua on ua.user_id=e.user_id
    where f.departure_date=CURRENT_DATE and l.weight>20 and e.user_id=$1;
`, [id]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Equipaje no encontrado' });
      }
  
      res.json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener el equipaje');
    }
};
//Obtener el peso promedio las maletas procesadas por empleado
export const getAvgLuggageByEmployeeNow = async (req, res) => {
    try {
  
      const result = await pool.query(`select avg(l.weight) as avg from flight f join reservation r on f.flight_id = r.flight_id
    join reservation_luggage rl on rl.reservation_id=r.reservation_id
    join luggage l on rl.luggage_id=l.luggage_id
    where f.departure_date=CURRENT_DATE
  `);
  
      res.json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener el equipaje');
    }
};
  
//Obtener el peso tener todas las maletas procesadas por empleado en un dia
export const getLuggagesByEmployeeNow = async (req,res) =>{
  const { id } = req.params;
    try {
        const result = await pool.query(`select concat(p.last_name_paternal,' ',p.last_name_maternal),r.reservation_id,s.seat_id,s.position,
     f.flight_id,(select ai.code from airport ai where ai.airport_id=f.destination_id)   as destination,
     l.luggage_id, l.description,l.weight,l.price, (select ch.checkin_id from checkIn ch where ch.reservation_id=r.reservation_id) as checkIn
    from  reservation r
    join reservation_luggage rl on rl.reservation_id=r.reservation_id
    join luggage l on l.luggage_id=rl.luggage_id
    join flight f on f.flight_id=r.flight_id
    join seat s on s.aircraft_id=r.aircraft_id and s.seat_id=r.seat_id
    join passenger p on p.passenger_id=r.passenger_id
    join flight_employee fe on fe.flight_id=f.flight_id
    join employee e on fe.employee_id=e.employee_id
    join user_airways ua on ua.user_id=e.user_id
    where f.departure_date=CURRENT_DATE and e.user_id=$1;`,
     [req.params.id]);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en la consulta para obtener todos los equipajes');
    }
};