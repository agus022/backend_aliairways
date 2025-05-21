import pool from '../libs/db_connection.js';
import bcrypt from 'bcrypt';

const roles = ['administrator', 'employee', 'passenger', 'student'];

const users = [
  { username: 'admin_user', password: 'admin123', email:'admin@aliairways.mx', phone:'4611111111', role: 'administrator' ,photo:'img1.png'},
  { username: 'employee_user', password: 'employee123', email:'employee@aliairways.mx', phone:'4611111111', role: 'employee' , photo:'img1.png'},
  { username: 'passenger_user', password: 'passenger123', email:'passenger@aliairways.mx', phone:'4611111111', role: 'passenger', photo:'img1.png'},
  { username: 'student_user', password: 'student123', email:'student@aliairways.mx', phone:'4611111111', role: 'student', photo:'img1.png' }
];

export const initializeData = async () => {
  try {
    // Crear roles si no existen
    for (const roleName of roles) {
      const result = await pool.query(
        'SELECT * FROM role WHERE name = $1',
        [roleName]
      );
      if (result.rows.length === 0) {
        await pool.query('INSERT INTO role(name) VALUES ($1)', [roleName]);
        console.log(`✅ Rol "${roleName}" creado.`);
      } else {
        console.log(`🔹 Rol "${roleName}" ya existe.`);
      }
    }

    // Obtener roles actualizados
    const rolesMap = {};
    const rolesResult = await pool.query('SELECT * FROM role');
    for (const r of rolesResult.rows) {
      rolesMap[r.name] = r.role_id;
    }

    // Crear usuarios base
    for (const user of users) {
      const userExists = await pool.query(
        'SELECT * FROM user_airways WHERE username = $1',
        [user.username]
      );

      if (userExists.rows.length === 0) {
        const hashedPassword = await bcrypt.hash(user.password, 10); //encripta la contraseña
        await pool.query(
          'INSERT INTO user_airways (username, password,email,phone, role_id, photo) VALUES ($1, $2, $3, $4, $5, $6)',
          [user.username, hashedPassword,user.email,user.phone, rolesMap[user.role],user.photo]
        );
        console.log(`✅ Usuario "${user.username}" creado con rol "${user.role}".`);
      } else {
        console.log(`🔹 Usuario "${user.username}" ya existe.`);
      }
    }

  } catch (error) {
    console.error('❌ Error al inicializar datos:', error.message);
  }
};
