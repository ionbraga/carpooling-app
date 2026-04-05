const { errorResponse } = require('../utils/apiResponse');

const errorHandler = (err, req, res, next) => {
  console.error('Global error handler:', err);

  if (res.headersSent) {
    return next(err);
  }

  if (err.code === '23505') {
    return errorResponse(res, 409, 'Resursa exista deja. A fost incalcata o constrangere de unicitate.');
  }

  if (err.code === '23503') {
    return errorResponse(res, 400, 'Referinta invalida catre o alta resursa din baza de date.');
  }

  if (err.code === '22P02') {
    return errorResponse(res, 400, 'Unul dintre valorile transmise are un format invalid.');
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'A aparut o eroare interna pe server';

  return errorResponse(res, statusCode, message, err.details || null);
};

module.exports = errorHandler;
