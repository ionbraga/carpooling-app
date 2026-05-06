const { pool } = require('../config/db');
const rideRepository = require('../repositories/rideRepository');
const bookingRepository = require('../repositories/bookingRepository');
const ApiError = require('../utils/ApiError');
const { isPositiveInteger, isValidDate, normalizeText } = require('../utils/validators');

const createRide = async (driverId, origin, destination, departureTime, availableSeats, price) => {
  if (!origin || !destination || !departureTime || availableSeats === undefined || price === undefined) {
    throw new ApiError(400, 'Toate campurile sunt obligatorii');
  }

  const normalizedOrigin = normalizeText(origin);
  const normalizedDestination = normalizeText(destination);
  const numericSeats = Number(availableSeats);
  const numericPrice = Number(price);

  if (normalizedOrigin.length < 2) {
    throw new ApiError(400, 'Originea trebuie sa contina cel putin 2 caractere');
  }

  if (normalizedDestination.length < 2) {
    throw new ApiError(400, 'Destinatia trebuie sa contina cel putin 2 caractere');
  }

  if (normalizedOrigin.toLowerCase() === normalizedDestination.toLowerCase()) {
    throw new ApiError(400, 'Originea si destinatia nu pot fi aceleasi');
  }

  if (!isValidDate(departureTime)) {
    throw new ApiError(400, 'Data plecarii este invalida');
  }

  if (new Date(departureTime) <= new Date()) {
    throw new ApiError(400, 'Data plecarii trebuie sa fie in viitor');
  }

  if (!isPositiveInteger(numericSeats)) {
    throw new ApiError(400, 'Numarul de locuri disponibile trebuie sa fie un numar intreg mai mare decat 0');
  }

  if (Number.isNaN(numericPrice) || numericPrice < 0) {
    throw new ApiError(400, 'Pretul trebuie sa fie un numar mai mare sau egal cu 0');
  }

  return rideRepository.createRide(
    driverId,
    normalizedOrigin,
    normalizedDestination,
    departureTime,
    numericSeats,
    numericPrice
  );
};

const getAllRides = async (queryParams = {}) => {
  const filters = {
    origin: queryParams.origin ? normalizeText(queryParams.origin) : null,
    destination: queryParams.destination ? normalizeText(queryParams.destination) : null,
    onlyAvailable:
      queryParams.only_available === 'true' || queryParams.only_available === true,
  };

  return rideRepository.getAllRides(filters);
};

const getMyRides = async (driverId) => {
  return rideRepository.getRidesByDriver(driverId);
};

const cancelRide = async (driverId, rideId) => {
  if (!rideId) {
    throw new ApiError(400, 'ride_id este obligatoriu');
  }

  const numericRideId = Number(rideId);

  if (!isPositiveInteger(numericRideId)) {
    throw new ApiError(400, 'ride_id trebuie sa fie un numar intreg pozitiv');
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const ride = await rideRepository.lockRideById(numericRideId, client);

    if (!ride) {
      throw new ApiError(404, 'Cursa nu exista');
    }

    if (Number(ride.driver_id) !== Number(driverId)) {
      throw new ApiError(403, 'Poti anula doar cursele create de tine');
    }

    if (ride.status !== 'active') {
      throw new ApiError(400, 'Cursa este deja anulata');
    }

    if (new Date(ride.departure_time) <= new Date()) {
      throw new ApiError(400, 'Nu poti anula o cursa care a trecut deja');
    }

    const cancelledRide = await rideRepository.cancelRide(numericRideId, client);

    const cancelledBookings = await bookingRepository.cancelConfirmedBookingsByRideId(
      numericRideId,
      client
    );

    await client.query('COMMIT');

    return {
      ride: cancelledRide,
      cancelled_bookings_count: cancelledBookings.length,
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  createRide,
  getAllRides,
  getMyRides,
  cancelRide,
};