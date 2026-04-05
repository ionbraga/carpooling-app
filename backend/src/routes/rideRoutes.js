const express = require('express');
const rideController = require('../controllers/rideController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', rideController.getAllRides);
router.post('/', authMiddleware, rideController.createRide);

module.exports = router;
