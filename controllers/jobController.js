import pool from '../libs/db_connection.js';

export const getJobs = async (req,res) =>{
    try {
        const result = await pool.query('SELECT * FROM job');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en la consulta');
    }
};

export const createJobs = async (req, res) =>{
    try {
        const {title,salary} =req.body;
        await pool.query(
            `INSERT INTO job (title,salary) VALUES($1,$2)`,
            [title,salary]
        );

        res.status(201).json({ message:'Trabajo creado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al crear el vuelo');
        
    }
}

export const updateJobs = async (req, res) => {
    try {
      const { id } = req.params;
      const { title, salary } = req.body;
  
      await pool.query(
        'UPDATE job SET title = $1, salary = $2 WHERE job_id = $3',
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
  
  
  
  