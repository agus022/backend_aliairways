import pool from '../libs/db_connection.js';

export const getShift = async (req,res) =>{
    try {
        const result = await pool.query('SELECT * FROM shift');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en la consulta');
    }
};

export const createShift = async (req, res) =>{
    try {
        const {start_time,end_time,shift_desc} =req.body;
        await pool.query(
            `INSERT INTO shift (start_time,end_time,shift_desc) VALUES($1,$2,$3)`,
            [start_time, end_time, shift_desc]
        );

        res.status(201).json({ message:'Turno creado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al crear el vuelo');
        
    }
}

export const updateShift = async (req, res) => {
    try {
      const { id } = req.params;
      const { start_time, end_time, shift_desc} = req.body;
  
      await pool.query(
        'UPDATE shift SET start_time = $1, end_time = $2, shift_desc = $3 WHERE shift_id = $4',
        [start_time, end_time,shift_desc, id]
      );
  
      res.json({ message: 'Trabajo actualizado correctamente' });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al actualizar el trabajo');
    }
};


export const deleteShift = async (req, res) => {
    try {
      const { id } = req.params;
  
      await pool.query('DELETE FROM shift WHERE shift_id = $1', [id]);
  
      res.json({ message: 'Turno eliminado correctamente' });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al eliminar el trabajo');
    }
};

export const getShiftById = async (req, res) => {
    try {
      const { id } = req.params;
  
      const result = await pool.query('SELECT * FROM shift WHERE shift_id = $1', [id]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Turno no encontrado' });
      }
  
      res.json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener el turno');
    }
};


export const getShiftsByDesc = async (req, res) => {
    try {
      const { desc } = req.params;
  
      const result = await pool.query(
        'SELECT * FROM shift WHERE LOWER(shift_desc) LIKE LOWER($1)',
        [`%${desc}%`]
      );
  
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al buscar turnos');
    }
  };
  
  
  