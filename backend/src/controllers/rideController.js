const rideService = require('../services/rideService');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');

const createRide = asyncHandler(async (req, res) => {
  const { origin, destination, departure_time, available_seats, price } = req.body;

  const ride = await rideService.createRide(
    req.user.id,
    origin,
    destination,
    departure_time,
    available_seats,
    price
  );

  return successResponse(res, 201, 'Cursa a fost creata cu succes', ride);
});

const getAllRides = asyncHandler(async (req, res) => {
  const rides = await rideService.getAllRides(req.query);
  return successResponse(res, 200, 'Cursele au fost preluate cu succes', rides);
});

module.exports = {
  createRide,
  getAllRides,
};
