const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const env = require('../config/env');
const userRepository = require('../repositories/userRepository');
const ApiError = require('../utils/ApiError');
const { isValidEmail, normalizeText } = require('../utils/validators');

const registerUser = async (name, email, password) => {
  if (!name || !email || !password) {
    throw new ApiError(400, 'Toate campurile sunt obligatorii');
  }

  const normalizedName = normalizeText(name);
  const normalizedEmail = normalizeText(email).toLowerCase();

  if (normalizedName.length < 2) {
    throw new ApiError(400, 'Numele trebuie sa contina cel putin 2 caractere');
  }

  if (!isValidEmail(normalizedEmail)) {
    throw new ApiError(400, 'Email invalid');
  }

  if (String(password).length < 6) {
    throw new ApiError(400, 'Parola trebuie sa contina cel putin 6 caractere');
  }

  const existingUser = await userRepository.findUserByEmail(normalizedEmail);
  if (existingUser) {
    throw new ApiError(409, 'Exista deja un cont asociat acestui email');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  return userRepository.createUser(normalizedName, normalizedEmail, hashedPassword);
};

const loginUser = async (email, password) => {
  if (!email || !password) {
    throw new ApiError(400, 'Email-ul si parola sunt obligatorii');
  }

  const normalizedEmail = normalizeText(email).toLowerCase();

  if (!isValidEmail(normalizedEmail)) {
    throw new ApiError(400, 'Email invalid');
  }

  const user = await userRepository.findUserByEmail(normalizedEmail);
  if (!user) {
    throw new ApiError(401, 'Email sau parola incorecta');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Email sau parola incorecta');
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
    },
  };
};

module.exports = {
  registerUser,
  loginUser,
};
