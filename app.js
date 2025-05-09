import express from 'express';
import dotenv from "dotenv"
import seatRoutes from './routers/seatRoutes.js';
import flightRoutes from './routers/flight.js';
import aircraftRoutes from './routers/aircraft.js';
import emailRoutes from './routers/emailRoutes.js';
import userRoutes from './routers/userRoutes.js';
import employeeRoutes from './routers/employee.route.js';
import jobRoutes from './routers/jobRoute.js'
import authJwt from './libs/jwt.js';
import shiftRoutes from './routers/shiftRoute.js';
import roleRoutes from './routers/roleRoute.js';
import luggageRoutes from './routers/luggageRoutes.js';
import passengerRoutes from './routers/passengerRoutes.js';

dotenv.config();
const PORT = process.env.PORT || 3000;
const API_PREFIX = process.env.API_PREFIX;

const app = express();
app.use(authJwt());
app.use(express.json());


app.use(`${API_PREFIX}/users`, userRoutes);
app.use(`${API_PREFIX}/employees`,employeeRoutes);
app.use(`${API_PREFIX}/flights`, flightRoutes);
app.use(`${API_PREFIX}/aircrafts`, aircraftRoutes);
app.use(`${API_PREFIX}/emails`, emailRoutes);
app.use(`${API_PREFIX}/jobs`, jobRoutes);
app.use(`${API_PREFIX}/shifts`, shiftRoutes);
app.use(`${API_PREFIX}/seats`, seatRoutes);
app.use(`${API_PREFIX}/roles`, roleRoutes);
app.use(`${API_PREFIX}/luggages`, luggageRoutes);
app.use(`${API_PREFIX}/passengers`, passengerRoutes);


app.listen(3000, () => {
    console.log(`Server is running on http://localhost:${PORT}${API_PREFIX}`);
});




