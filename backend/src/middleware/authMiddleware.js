const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/apiResponse');
const env = require('../config/env');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return errorResponse(res, 401, 'Token lipsa');
  }

  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return errorResponse(res, 401, 'Format token invalid. Se accepta doar Bearer token.');
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    req.user = decoded;
    return next();
  } catch (error) {
    return errorResponse(res, 401, 'Token invalid sau expirat');
  }
};

module.exports = authMiddleware;
