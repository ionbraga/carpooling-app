const express = require('express');
const rideController = require('../controllers/rideController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', rideController.getAllRides);
router.get('/my', authMiddleware, rideController.getMyRides);
router.post('/', authMiddleware, rideController.createRide);
router.patch('/:id/cancel', authMiddleware, rideController.cancelRide);

module.exports = router;