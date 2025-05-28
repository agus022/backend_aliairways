import pool from '../libs/db_connection.js';



// datos del empleado y su salario
export const getDataByEmployee = async (req, res) => {
    try{
      const { id } = req.params;
  
      const result = await pool.query(`select e.first_name,j.title,e.employee_id,j.title,j.salary as salary from employee e
   join user_airways ua on ua.user_id=e.user_id
    join job j on j.job_id=e.job_id
   where ua.user_id=$1;`, [id]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Turno no encontrado' });
      }
  
      res.json(result.rows[0]);
    }catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los datos del empleado');
    }
}
export const getPayrollByEmployee = async (req, res) => {
    try{
      const { id } = req.params;
  
      const result = await pool.query(`select p.company,p.period_start,p.period_end,p.base_salary,p.bonus,p.deduction,p.total_earnings,p.net_salary,p.date_issued from employee e
   join user_airways ua on ua.user_id=e.user_id
    join payroll p on p.employee_id=e.employee_id
   where ua.user_id=$1
    order by p.period_start desc, p.period_end asc;
`, [id]);
  
      res.json(result.rows);
    }catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los datos del empleado');
    }
}
