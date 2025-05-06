import pool from '../libs/db_connection.js';

export const getEmployees = async (req,res) =>{
    const result = await pool.query('SELECT * FROM employee');
    res.json(result.rows);
};

export const getEmployeeById = async (req, res) =>{
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM employee WHERE employee_id = $1', [id]);
    res.json(result.rows[0]);
};

export const addEmployee = async (req,res) =>{
    const {job_id,shift_id,first_name,last_name_maternal,last_name_paternal,passport,curp,rfc,birth_date,user_id} = req.body;

    await pool.query(
        `INSERT INTO employee (
        job_id, shift_id, first_name, last_name_maternal, last_name_paternal,passport, curp, rfc, birth_date, user_id) 
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,   
        [job_id, shift_id, first_name, last_name_maternal, last_name_paternal, passport, curp, rfc, birth_date, user_id]
    );

    res.status(201).json({ message: 'Create Employee Successfully' });

}