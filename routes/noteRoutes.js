const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * @swagger
 * tags:
 *   name: Notes
 *   description: Note management endpoints
 */

/**
 * @swagger
 * /notes/add:
 *   post:
 *     summary: Create a new note
 *     tags: [Notes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               diaryName:
 *                 type: string
 *                 description: Name of the diary
 *               candidate:
 *                 type: string
 *                 description: Name of the candidate
 *               channel:
 *                 type: string
 *                 description: Channel where they met
 *               zodiacSign:
 *                 type: string
 *                 description: Candidate's zodiac sign
 *               datePurpose:
 *                 type: string
 *                 description: Purpose of the date
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Date of the note
 *               place:
 *                 type: string
 *                 description: Place where the date occurred
 *               timesOfDate:
 *                 type: integer
 *                 description: Number of times they have dated
 *               reflection:
 *                 type: string
 *                 description: Reflection on the date
 *               cost:
 *                 type: number
 *                 format: float
 *                 description: Cost of the date
 *               nextDate:
 *                 type: string
 *                 description: Plan for the next date
 *     responses:
 *       201:
 *         description: Note created successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Error saving note
 */
router.post('/add', async (req, res) => {
    const { diaryName, candidate, channel, zodiacSign, datePurpose, date, place, timesOfDate, reflection, cost, nextDate } = req.body;

    if (!diaryName || !candidate || !channel || !zodiacSign || !datePurpose || !date || !place || !timesOfDate || !reflection || !cost || !nextDate) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const [noteId] = await db('notes').insert({
            diary_name: diaryName,
            candidate,
            channel,
            zodiac_sign: zodiacSign,
            date_purpose: datePurpose,
            date,
            place,
            times_of_date: timesOfDate,
            reflection,
            cost,
            next_date: nextDate
        });

        res.status(201).json({ message: 'Note created successfully', noteId });
    } catch (error) {
        console.error('Error saving note:', error);
        res.status(500).json({ message: 'Error saving note' });
    }
});

/**
 * @swagger
 * /notes:
 *   get:
 *     summary: Get all notes
 *     tags: [Notes]
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
 *                   note_id:
 *                     type: integer
 *                   diary_name:
 *                     type: string
 *                   candidate:
 *                     type: string
 *                   channel:
 *                     type: string
 *                   zodiac_sign:
 *                     type: string
 *                   date_purpose:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date
 *                   place:
 *                     type: string
 *                   times_of_date:
 *                     type: integer
 *                   reflection:
 *                     type: string
 *                   cost:
 *                     type: number
 *                     format: float
 *                   next_date:
 *                     type: string
 *       500:
 *         description: Failed to fetch notes
 */
router.get('/', async (req, res) => {
    try {
        const notes = await db('notes').select('*');
        res.status(200).json(notes);
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ message: 'Failed to fetch notes' });
    }
});

/**
 * @swagger
 * /notes/{id}:
 *   delete:
 *     summary: Delete a note by ID
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The note ID
 *     responses:
 *       200:
 *         description: Note deleted successfully
 *       404:
 *         description: Note not found
 *       500:
 *         description: Failed to delete note
 */
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedRows = await db('notes').where({ note_id: id }).del();

        if (deletedRows === 0) {
            return res.status(404).json({ message: 'Note not found' });
        }

        res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error) {
        console.error('Error deleting note:', error);
        res.status(500).json({ message: 'Failed to delete note' });
    }
});

module.exports = router;
