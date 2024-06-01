const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Appointment booking endpoints
 */

/**
 * @swagger
 * /bookings/add:
 *   post:
 *     summary: Create a new booking
 *     tags: [Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: User ID
 *               appointmentType:
 *                 type: string
 *                 description: Type of appointment
 *               appointmentDateTime:
 *                 type: string
 *                 format: date-time
 *                 description: Date and time of the appointment
 *               salonName:
 *                 type: string
 *                 description: Name of the salon
 *               cost:
 *                 type: number
 *                 format: float
 *                 description: Cost of the appointment
 *               times:
 *                 type: integer
 *                 description: Number of times the appointment has been made
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Error saving appointment
 */
router.post('/add', async (req, res) => {
    const { userId, appointmentType, appointmentDateTime, salonName, cost, times } = req.body;

    if (!userId || !appointmentType || !appointmentDateTime || !salonName || !cost || !times) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const [bookingId] = await db('bookings').insert({
            user_id: userId,
            appointment_type: appointmentType,
            appointment_date: appointmentDateTime,
            salon_name: salonName,
            cost,
            times,
        });

        res.status(201).json({ message: 'Booking created successfully', bookingId });
    } catch (error) {
        console.error('Error saving appointment:', error);
        res.status(500).json({ message: 'Error saving appointment' });
    }
});

/**
 * @swagger
 * /bookings:
 *   get:
 *     summary: Get all bookings
 *     tags: [Bookings]
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   booking_id:
 *                     type: integer
 *                   user_id:
 *                     type: integer
 *                   appointment_type:
 *                     type: string
 *                   appointment_date:
 *                     type: string
 *                     format: date-time
 *                   salon_name:
 *                     type: string
 *                   cost:
 *                     type: number
 *                     format: float
 *                   times:
 *                     type: integer
 *       500:
 *         description: Failed to fetch bookings
 */
router.get('/', async (req, res) => {
    try {
        const bookings = await db('bookings').select('*');
        res.status(200).json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: 'Failed to fetch bookings' });
    }
});

/**
 * @swagger
 * /bookings/{id}:
 *   delete:
 *     summary: Delete a booking by ID
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The booking ID
 *     responses:
 *       200:
 *         description: Booking deleted successfully
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Failed to delete booking
 */
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedRows = await db('bookings').where({ booking_id: id }).del();

        if (deletedRows === 0) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
        console.error('Error deleting booking:', error);
        res.status(500).json({ message: 'Failed to delete booking' });
    }
});

module.exports = router;
