import express from 'express';
import dotenv from "dotenv"
import pool from './libs/db_connection.js';
import flight from './routers/flight.js';
import aircraft from './routers/aircraft.js';
import emailRoutes from './routers/emailRoutes.js';
import employeeRoutes from './routers/employee.route.js';

dotenv.config();
const PORT = process.env.PORT || 3000;
const API_PREFIX = process.env.API_PREFIX;

const app = express();
app.use(express.json());


app.get(`${API_PREFIX}/test`, async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ time: result.rows[0].now });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en conexión');
  }
});

app.use(`${API_PREFIX}/employees`,employeeRoutes);
app.use(`${API_PREFIX}/flights`, flight);
app.use(`${API_PREFIX}/aircrafts`, aircraft);
app.use(`${API_PREFIX}/emails`, emailRoutes);

app.listen(3000, () => {
    console.log(`Server is running on http://localhost:${PORT}${API_PREFIX}`);
});




