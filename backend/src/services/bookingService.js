const { pool } = require('../config/db');
const bookingRepository = require('../repositories/bookingRepository');
const rideRepository = require('../repositories/rideRepository');
const ApiError = require('../utils/ApiError');
const { isPositiveInteger } = require('../utils/validators');
const { isBeforeOrEqualMoldovaNow } = require('../utils/dateTime');

const createBooking = async (userId, rideId, seatsBooked) => {
  if (!rideId) {
    throw new ApiError(400, 'ride_id este obligatoriu');
  }

  if (seatsBooked === undefined || seatsBooked === null) {
    throw new ApiError(400, 'seats_booked este obligatoriu');
  }

  const numericRideId = Number(rideId);
  const numericSeatsBooked = Number(seatsBooked);

  if (!isPositiveInteger(numericRideId)) {
    throw new ApiError(400, 'ride_id trebuie sa fie un numar intreg pozitiv');
  }

  if (!isPositiveInteger(numericSeatsBooked)) {
    throw new ApiError(400, 'seats_booked trebuie sa fie un numar intreg pozitiv');
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const ride = await rideRepository.lockRideById(numericRideId, client);
    if (!ride) {
      throw new ApiError(404, 'Cursa nu exista');
    }

    if (ride.status !== 'active') {
      throw new ApiError(400, 'Cursa nu este activa si nu poate fi rezervata');
    }

    if (isBeforeOrEqualMoldovaNow(ride.departure_time)) {
  throw new ApiError(400, 'Nu poti rezerva o cursa care a trecut deja');
}

    if (Number(ride.driver_id) === Number(userId)) {
      throw new ApiError(400, 'Nu poti rezerva un loc in propria ta cursa');
    }

    const existingBooking = await bookingRepository.findExistingUserBookingForRide(
      userId,
      numericRideId,
      client
    );

    if (existingBooking) {
      throw new ApiError(409, 'Ai deja o rezervare confirmata pentru aceasta cursa');
    }

    if (Number(ride.available_seats) < numericSeatsBooked) {
      throw new ApiError(400, 'Nu sunt suficiente locuri disponibile');
    }

    const updatedAvailableSeats = Number(ride.available_seats) - numericSeatsBooked;
    await rideRepository.updateAvailableSeats(numericRideId, updatedAvailableSeats, client);

    const booking = await bookingRepository.createBooking(
      userId,
      numericRideId,
      numericSeatsBooked,
      'confirmed',
      client
    );

    await client.query('COMMIT');
    return booking;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const cancelBooking = async (userId, bookingId) => {
  if (!bookingId) {
    throw new ApiError(400, 'booking_id este obligatoriu');
  }

  const numericBookingId = Number(bookingId);

  if (!isPositiveInteger(numericBookingId)) {
    throw new ApiError(400, 'booking_id trebuie sa fie un numar intreg pozitiv');
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const booking = await bookingRepository.findBookingByIdForUpdate(numericBookingId, client);

    if (!booking) {
      throw new ApiError(404, 'Rezervarea nu exista');
    }

    if (Number(booking.user_id) !== Number(userId)) {
      throw new ApiError(403, 'Nu poti anula rezervarea altui utilizator');
    }

    if (booking.status !== 'confirmed') {
      throw new ApiError(400, 'Rezervarea nu este activa sau a fost deja anulata');
    }

    if (booking.ride_status !== 'active') {
      throw new ApiError(400, 'Cursa asociata acestei rezervari nu mai este activa');
    }

    if (isBeforeOrEqualMoldovaNow(booking.departure_time)) {
  throw new ApiError(400, 'Nu poti anula o rezervare dupa plecarea cursei');
}

    const ride = await rideRepository.lockRideById(booking.ride_id, client);

    if (!ride) {
      throw new ApiError(404, 'Cursa asociata rezervarii nu exista');
    }

    const updatedAvailableSeats = Number(ride.available_seats) + Number(booking.seats_booked);

    await rideRepository.updateAvailableSeats(booking.ride_id, updatedAvailableSeats, client);

    const cancelledBooking = await bookingRepository.cancelBooking(numericBookingId, client);

    await client.query('COMMIT');
    return cancelledBooking;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const getUserBookings = async (userId) => {
  return bookingRepository.getUserBookings(userId);
};

module.exports = {
  createBooking,
  cancelBooking,
  getUserBookings,
};