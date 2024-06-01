// backend/controllers/noteController.js
const db = require('../db');

const addNote = async (req, res) => {
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
};

const getNotes = async (req, res) => {
    try {
        const notes = await db('notes').select('*');
        res.status(200).json(notes);
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ message: 'Failed to fetch notes' });
    }
};

const deleteNote = async (req, res) => {
    const { noteId } = req.params;

    try {
        const deletedRows = await db('notes').where({ diary_id: noteId }).del();

        if (deletedRows === 0) {
            return res.status(404).json({ message: 'Note not found' });
        }

        res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error) {
        console.error('Error deleting note:', error);
        res.status(500).json({ message: 'Error deleting note' });
    }
};

module.exports = {
    addNote,
    getNotes,
    deleteNote,
};
