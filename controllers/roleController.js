import pool from '../libs/db_connection.js';

export const getRoles = async (req,res) =>{
    try {
        const result = await pool.query('SELECT * FROM role');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en la consulta para obtener todos los roles');
    }
};

export const createRole = async (req, res) =>{
    try {
        const {name} =req.body;
        await pool.query(
            `INSERT INTO role (name) VALUES($1)`,
            [name]
        );

        res.status(201).json({ message:'Rol creado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al crear el rol');
        
    }
}

export const updateRole = async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
  
      await pool.query(
        'UPDATE role SET name = $1 WHERE role_id = $2',
        [name, id]
      );
  
      res.json({ message: 'Rol actualizado correctamente' });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al actualizar el rol');
    }
};


export const deleteRole = async (req, res) => {
    try {
      const { id } = req.params;
  
      await pool.query('DELETE FROM role WHERE role_id = $1', [id]);
  
      res.json({ message: 'Rol eliminado correctamente' });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al eliminar el rol');
    }
};

export const getRolById = async (req, res) => {
    try {
      const { id } = req.params;
  
      const result = await pool.query('SELECT * FROM role WHERE role_id = $1', [id]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Rol no encontrado' });
      }
  
      res.json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener el rol');
    }
};
  
export const searchRolesByName = async (req, res) => {
  try {
    const { name } = req.query;

    const result = await pool.query(
      'SELECT * FROM role WHERE LOWER(name) LIKE LOWER($1)',
      [`%${name}%`]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al buscar roles por nombre');
  }
};
  