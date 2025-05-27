import pool from '../libs/db_connection.js';

export const getDataByEmployee = async (req, res) => {
    try{
      const { id } = req.params;
  
      const result = await pool.query('SELECT * FROM shift WHERE shift_id = $1', [id]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Turno no encontrado' });
      }
  
      res.json(result.rows[0]);
    }catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los datos del empleado');
    }
}