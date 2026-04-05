const express = require('express');
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, bookingController.createBooking);
router.get('/my', authMiddleware, bookingController.getMyBookings);

module.exports = router;
