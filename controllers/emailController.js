import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import pool from '../libs/db_connection.js';

dotenv.config();

export const sendEmail = async (req, res) => {
    const { to, subject, text } = req.body;

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const info = await transporter.sendMail({
            from: `"Airways Support" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text
        });

        res.status(200).json({ message: 'Correo enviado', info });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al enviar el correo' });
    }
};
export const sendEmailWithReservation = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(`
            SELECT 
                r.reservation_id, r.flight_id,
                f.departure_date, f.arrival_date, f.departure_time, f.arrival_time,
                (SELECT ai.name FROM airport ai WHERE ai.airport_id = f.origin_id) AS name_origin,
                (SELECT ai.city FROM airport ai WHERE ai.airport_id = f.origin_id) AS city_origin,
                (SELECT ai.name FROM airport ai WHERE ai.airport_id = f.destination_id) AS name_destination,
                (SELECT ai.city FROM airport ai WHERE ai.airport_id = f.destination_id) AS city_destination,
                (SELECT CONCAT(s.seat_id, ' ', s.position, ' -> class ', s.class)
                 FROM seat s
                 WHERE s.aircraft_id = f.aircraft_id AND s.seat_id = r.seat_id) AS seat,
                u.email
            FROM reservation r
            JOIN flight f ON f.flight_id = r.flight_id
            JOIN aircraft a ON a.aircraft_id = f.aircraft_id
            JOIN user_reservation ur ON r.reservation_id = ur.reservation_id
            JOIN user_airways u ON ur.user_id = u.user_id
            WHERE r.reservation_id = $1
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontró la reservación' });
        }

        const reservation = result.rows[0];

        const subject = `Tu reservación se ha generado: ${id}`;
        const text = `
Tu reservación ha sido generada exitosamente:
✈️ Reservación: ${reservation.reservation_id}
✈️ Vuelo: ${reservation.flight_id}
📅 Fecha salida: ${reservation.departure_date} a las ${reservation.departure_time}
📅 Fecha llegada: ${reservation.arrival_date} a las ${reservation.arrival_time}

🛫 Origen: ${reservation.name_origin}, ${reservation.city_origin}
🛬 Destino: ${reservation.name_destination}, ${reservation.city_destination}

🪑 Asiento: ${reservation.seat}

Gracias por reservar con Airways.
        `;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const info = await transporter.sendMail({
            from: `"Airways Support" <${process.env.EMAIL_USER}>`,
            to: reservation.email,
            subject,
            text
        });

        return res.status(200).json({
            message: 'Correo enviado exitosamente',
            info,
            reservation
        });

    } catch (error) {
        console.error('Error al enviar el correo:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

