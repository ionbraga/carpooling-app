const bcrypt = require('bcrypt');

const userRepository = require('../repositories/userRepository');
const ApiError = require('../utils/ApiError');
const validators = require('../utils/validators');

const normalizeText =
  validators.normalizeText ||
  ((value) => String(value ?? '').trim());

const isValidName =
  validators.isValidName ||
  ((name) => {
    const value = normalizeText(name);

    if (value.length < 2 || value.length > 50) {
      return false;
    }

    return /^[A-Za-zĂÂÎȘȚăâîșț' -]+$/u.test(value);
  });

const isStrongPassword =
  validators.isStrongPassword ||
  ((password) => {
    const value = String(password ?? '');

    if (value.length < 8 || value.length > 64) return false;
    if (/\s/.test(value)) return false;
    if (!/[a-z]/.test(value)) return false;
    if (!/[A-Z]/.test(value)) return false;
    if (!/[0-9]/.test(value)) return false;

    return true;
  });

const normalizeStats = (stats) => ({
  published_rides_count: Number(stats?.published_rides_count || 0),
  active_rides_count: Number(stats?.active_rides_count || 0),
  bookings_count: Number(stats?.bookings_count || 0),
  active_bookings_count: Number(stats?.active_bookings_count || 0),
  reviews_received_count: Number(stats?.reviews_received_count || 0),
  average_rating: Number(stats?.average_rating || 0),
});

const getMyProfile = async (userId) => {
  const user = await userRepository.findUserById(userId);

  if (!user) {
    throw new ApiError(404, 'Utilizatorul nu a fost gasit');
  }

  const stats = await userRepository.getUserProfileStats(userId);
const receivedReviews = await userRepository.getRecentReviewsForUser(userId);

return {
  user,
  statistics: normalizeStats(stats),
  received_reviews: receivedReviews,
};
};

const updateMyProfile = async (userId, name) => {
  const normalizedName = normalizeText(name).replace(/\s+/g, ' ');

  if (!normalizedName) {
    throw new ApiError(400, 'Numele este obligatoriu');
  }

  if (!isValidName(normalizedName)) {
    throw new ApiError(
      400,
      'Numele trebuie sa contina intre 2 si 50 de caractere si poate include doar litere, spatii, cratima sau apostrof'
    );
  }

  const user = await userRepository.findUserById(userId);

  if (!user) {
    throw new ApiError(404, 'Utilizatorul nu a fost gasit');
  }

  return userRepository.updateUserName(userId, normalizedName);
};

const changeMyPassword = async (
  userId,
  currentPassword,
  newPassword,
  confirmNewPassword
) => {
  if (!currentPassword || !newPassword || !confirmNewPassword) {
    throw new ApiError(400, 'Toate campurile pentru schimbarea parolei sunt obligatorii');
  }

  if (newPassword !== confirmNewPassword) {
    throw new ApiError(400, 'Parola noua si confirmarea parolei nu coincid');
  }

  if (!isStrongPassword(newPassword)) {
    throw new ApiError(
      400,
      'Parola noua trebuie sa aiba intre 8 si 64 de caractere, cel putin o litera mica, o litera mare si o cifra, fara spatii'
    );
  }

  const user = await userRepository.findUserByIdWithPassword(userId);

  if (!user) {
    throw new ApiError(404, 'Utilizatorul nu a fost gasit');
  }

  const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);

  if (!isCurrentPasswordValid) {
    throw new ApiError(401, 'Parola actuala este incorecta');
  }

  const isSamePassword = await bcrypt.compare(newPassword, user.password);

  if (isSamePassword) {
    throw new ApiError(400, 'Parola noua trebuie sa fie diferita de parola actuala');
  }

  const lowerPassword = String(newPassword).toLowerCase();
  const emailPrefix = String(user.email).split('@')[0].toLowerCase();
  const lowerName = String(user.name).toLowerCase();

  if (
    lowerPassword.includes(emailPrefix) ||
    lowerPassword.includes(lowerName)
  ) {
    throw new ApiError(400, 'Parola noua nu trebuie sa contina numele sau emailul');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await userRepository.updateUserPassword(userId, hashedPassword);

  return {
    changed: true,
  };
};

module.exports = {
  getMyProfile,
  updateMyProfile,
  changeMyPassword,
};