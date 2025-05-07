import pool from '../libs/db_connection.js';

export const getEmployees = async (req,res) =>{
    try {
        const result = await pool.query('SELECT * FROM employee');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en la consulta');
    }

};

export const getEmployeeById = async (req, res) =>{

    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM employee WHERE employee_id = $1', [id]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en la consulta');
    }

};

export const addEmployee = async (req,res) =>{

    try {
        const {job_id,shift_id,first_name,last_name_maternal,last_name_paternal,passport,curp,rfc,birth_date,user_id} = req.body;

    await pool.query(
       `INSERT INTO employee (
        job_id, shift_id, first_name, last_name_maternal, last_name_paternal,passport, curp, rfc, birth_date, user_id) 
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,   
        [job_id, shift_id, first_name, last_name_maternal, last_name_paternal, passport, curp, rfc, birth_date, user_id]
    );

    res.status(201).json({ message:'Empleado creado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en la consulta');
    }
    
}

export const updateEmployee = async (req, res) =>{
    try {
    const {id} = req.params;
    const {job_id,shift_id,first_name,last_name_maternal,last_name_paternal,passport,curp,rfc,birth_date,user_id} = req.body;

    await pool.query(
       `UPDATE employee SET
        job_id = $1, shift_id = $2, first_name = $3, last_name_maternal = $4,
        last_name_paternal = $5, passport = $6, curp = $7, rfc = $8,
        birth_date = $9, user_id = $10
        WHERE employee_id = $11`,
        [job_id, shift_id, first_name, last_name_maternal, last_name_paternal, passport, curp, rfc, birth_date, user_id, id]
    
    );
    res.json({message: 'Empleado actualizado correctamente'});
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en la consulta');
    }
    
};

export const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query(`DELETE FROM employee WHERE employee_id = $1`, [id]);
        res.json({ message: 'Empleado eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en la consulta');
    }
   
};