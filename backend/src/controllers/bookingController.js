const bookingService = require('../services/bookingService');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');

const createBooking = asyncHandler(async (req, res) => {
  const { ride_id, seats_booked } = req.body;

  const booking = await bookingService.createBooking(req.user.id, ride_id, seats_booked);

  return successResponse(res, 201, 'Rezervarea a fost creata cu succes', booking);
});

const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await bookingService.getUserBookings(req.user.id);

  return successResponse(res, 200, 'Rezervarile utilizatorului au fost preluate cu succes', bookings);
});

module.exports = {
  createBooking,
  getMyBookings,
};
