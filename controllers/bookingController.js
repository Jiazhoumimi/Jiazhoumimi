// backend/controllers/bookingController.js
const db = require('../db');

const addBooking = async (req, res) => {
    // 添加预约的逻辑
};

const getBookings = async (req, res) => {
    // 获取预约的逻辑
};

const deleteBooking = async (req, res) => {
    const { bookingId } = req.params;

    try {
        const deletedRows = await db('bookings').where({ booking_id: bookingId }).del();
        
        if (deletedRows === 0) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
        console.error('Error deleting booking:', error);
        res.status(500).json({ message: 'Error deleting booking' });
    }
};

module.exports = {
    addBooking,
    getBookings,
    deleteBooking,
};
