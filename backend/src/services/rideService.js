const rideRepository = require('../repositories/rideRepository');
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

module.exports = {
  createRide,
  getAllRides,
};
