const { pool } = require('../config/db');
const rideRepository = require('../repositories/rideRepository');
const bookingRepository = require('../repositories/bookingRepository');
const ApiError = require('../utils/ApiError');
const { isPositiveInteger, normalizeText } = require('../utils/validators');
const {
  isValidDateTimeLocal,
  isAtLeastMinutesInFutureMoldova,
  isBeforeOrEqualMoldovaNow,
} = require('../utils/dateTime');
const {
  isKnownMoldovaCity,
  getMoldovaCityLabel,
  normalizeCity,
} = require('../data/moldovaCities');

const createRide = async (driverId, origin, destination, departureTime, availableSeats, price) => {
  if (
    !origin ||
    !destination ||
    !departureTime ||
    availableSeats === undefined ||
    availableSeats === null ||
    String(availableSeats).trim() === '' ||
    price === undefined ||
    price === null ||
    String(price).trim() === ''
  ) {
    throw new ApiError(400, 'Toate campurile sunt obligatorii');
  }

  const normalizedOriginInput = normalizeText(origin);
  const normalizedDestinationInput = normalizeText(destination);

  const numericSeats = Number(availableSeats);
  const numericPrice = Number(price);

  if (normalizedOriginInput.length < 2 || normalizedOriginInput.length > 50) {
    throw new ApiError(400, 'Originea trebuie sa contina intre 2 si 50 de caractere');
  }

  if (normalizedDestinationInput.length < 2 || normalizedDestinationInput.length > 50) {
    throw new ApiError(400, 'Destinatia trebuie sa contina intre 2 si 50 de caractere');
  }

  if (!isKnownMoldovaCity(normalizedOriginInput)) {
    throw new ApiError(400, 'Originea trebuie selectata din lista de localitati disponibile');
  }

  if (!isKnownMoldovaCity(normalizedDestinationInput)) {
    throw new ApiError(400, 'Destinatia trebuie selectata din lista de localitati disponibile');
  }

  if (normalizeCity(normalizedOriginInput) === normalizeCity(normalizedDestinationInput)) {
    throw new ApiError(400, 'Originea si destinatia nu pot fi aceleasi');
  }

if (!isValidDateTimeLocal(departureTime)) {
  throw new ApiError(400, 'Data plecarii este invalida');
}

if (!isAtLeastMinutesInFutureMoldova(departureTime, 10)) {
  throw new ApiError(
    400,
    'Data plecarii trebuie sa fie cu cel putin 10 minute in viitor'
  );
}

  const selectedDate = new Date(departureTime);
  const minimumAllowedDate = new Date(Date.now() + 10 * 60 * 1000);

  if (selectedDate < minimumAllowedDate) {
    throw new ApiError(400, 'Data plecarii trebuie sa fie cu cel putin 10 minute in viitor');
  }

  if (!isPositiveInteger(numericSeats)) {
    throw new ApiError(
      400,
      'Numarul de locuri disponibile trebuie sa fie un numar intreg mai mare decat 0'
    );
  }

  if (numericSeats > 8) {
    throw new ApiError(400, 'Numarul de locuri disponibile nu poate fi mai mare de 8');
  }

  if (Number.isNaN(numericPrice) || numericPrice < 0) {
    throw new ApiError(400, 'Pretul trebuie sa fie un numar mai mare sau egal cu 0');
  }

  if (numericPrice > 5000) {
    throw new ApiError(400, 'Pretul nu poate depasi 5000 MDL');
  }

  const normalizedOrigin = getMoldovaCityLabel(normalizedOriginInput);
  const normalizedDestination = getMoldovaCityLabel(normalizedDestinationInput);

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

    if (isBeforeOrEqualMoldovaNow(ride.departure_time)) {
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