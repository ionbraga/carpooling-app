const authService = require('../services/authService');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const user = await authService.registerUser(name, email, password);

  return successResponse(res, 201, 'Utilizator inregistrat cu succes', user);
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.loginUser(email, password);

  return successResponse(res, 200, 'Autentificare reusita', result);
});

module.exports = {
  register,
  login,
};
