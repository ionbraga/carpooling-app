const { errorResponse } = require('../utils/apiResponse');

const notFoundHandler = (req, res) => {
  return errorResponse(res, 404, `Ruta ${req.method} ${req.originalUrl} nu exista`);
};

module.exports = notFoundHandler;
