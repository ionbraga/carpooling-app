const { errorResponse } = require('../utils/apiResponse');
const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.code === '23505') {
    if (err.constraint === 'users_email_key') {
      return errorResponse(res, 409, 'Exista deja un cont asociat acestui email.');
    }

    return errorResponse(
      res,
      409,
      'Resursa exista deja. A fost incalcata o constrangere de unicitate.'
    );
  }

  if (err.statusCode) {
    return errorResponse(res, err.statusCode, err.message);
  }

  return errorResponse(res, 500, 'A aparut o eroare interna pe server.');
};

module.exports = errorHandler;