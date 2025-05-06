import express from 'express';
import pool from './libs/db_connection.js';

const app = express();
app.use(express.json());

app.get('/api/test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ time: result.rows[0].now });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en conexión');
  }
});

app.listen(3000, () => {
  console.log('Servidor local en http://localhost:3000');
});
