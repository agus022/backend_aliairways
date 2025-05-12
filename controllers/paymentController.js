import pool from '../libs/db_connection.js';

export const getAllPayments = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM payment');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los pagos');
  }
};

export const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM payment WHERE payment_id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Pago no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener el pago');
  }
};

export const createPayment = async (req, res) => {
  try {
    const { method, transaction_amount, status, date } = req.body;

    await pool.query(
      'INSERT INTO payment (method, transaction_amount, status, date) VALUES ($1, $2, $3, $4)',
      [method, transaction_amount, status, date]
    );

    res.status(201).json({ message: 'Pago creado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al crear el pago');
  }
};

export const updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { method, transaction_amount, status, date } = req.body;

    await pool.query(
      'UPDATE payment SET method = $1, transaction_amount = $2, status = $3, date = $4 WHERE payment_id = $5',
      [method, transaction_amount, status, date, id]
    );

    res.json({ message: 'Pago actualizado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al actualizar el pago');
  }
};

export const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM payment WHERE payment_id = $1', [id]);
    res.json({ message: 'Pago eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al eliminar el pago');
  }
};

export const getPaymentsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const result = await pool.query(
      'SELECT * FROM payment WHERE LOWER(status) = LOWER($1)',
      [status]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener pagos por estado');
  }
};


export const getTotalTransactionAmount = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT SUM(transaction_amount) AS total_amount FROM payment'
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al calcular el total de pagos');
  }
};
