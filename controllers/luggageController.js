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
  
  
  