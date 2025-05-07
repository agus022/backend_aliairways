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
            `INSERT INTO shift (start_time,end_time,shift_desc) VALUES($1,$2,$3)`
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
        'UPDATE shift SET start_time = $1, end_time = $2, shift_desc = $3 WHERE job_id = $4',
        [title, salary, id]
      );
  
      res.json({ message: 'Trabajo actualizado correctamente' });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al actualizar el trabajo');
    }
};


export const deleteJobs = async (req, res) => {
    try {
      const { id } = req.params;
  
      await pool.query('DELETE FROM job WHERE job_id = $1', [id]);
  
      res.json({ message: 'Trabajo eliminado correctamente' });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al eliminar el trabajo');
    }
};

export const getJobById = async (req, res) => {
    try {
      const { id } = req.params;
  
      const result = await pool.query('SELECT * FROM job WHERE job_id = $1', [id]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Trabajo no encontrado' });
      }
  
      res.json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener el trabajo');
    }
};


export const getJobsWithEmployees = async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT j.job_id, j.title, COUNT(e.employee_id) AS total_employees
        FROM job j
        LEFT JOIN employee e ON j.job_id = e.job_id
        GROUP BY j.job_id, j.title
        ORDER BY total_employees DESC
      `);
  
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener trabajos con empleados');
    }
};
  
  
  
  