const reviewRepository = require('../repositories/reviewRepository');
const userRepository = require('../repositories/userRepository');
const ApiError = require('../utils/ApiError');

const createReview = async (reviewerId, reviewedUserId, rating, comment) => {
  if (!reviewedUserId) {
    throw new ApiError(400, 'reviewed_user_id este obligatoriu');
  }

  if (rating === undefined || rating === null) {
    throw new ApiError(400, 'rating este obligatoriu');
  }

  const numericReviewedUserId = Number(reviewedUserId);
  const numericRating = Number(rating);

  if (!Number.isInteger(numericReviewedUserId) || numericReviewedUserId <= 0) {
    throw new ApiError(400, 'reviewed_user_id trebuie sa fie un numar intreg pozitiv');
  }

  if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
    throw new ApiError(400, 'Ratingul trebuie sa fie un numar intreg intre 1 si 5');
  }

  if (Number(reviewerId) === numericReviewedUserId) {
    throw new ApiError(400, 'Nu iti poti lasa review tie insuti');
  }

  const reviewedUser = await userRepository.findUserById(numericReviewedUserId);
  if (!reviewedUser) {
    throw new ApiError(404, 'Utilizatorul evaluat nu exista');
  }

  const existingReview = await reviewRepository.findExistingReview(reviewerId, numericReviewedUserId);
  if (existingReview) {
    throw new ApiError(409, 'Ai lasat deja un review pentru acest utilizator');
  }

  const normalizedComment = comment ? String(comment).trim() : null;

  if (normalizedComment && normalizedComment.length > 500) {
    throw new ApiError(400, 'Comentariul nu poate depasi 500 de caractere');
  }

  return reviewRepository.createReview(reviewerId, numericReviewedUserId, numericRating, normalizedComment);
};

const getReviewsForUser = async (userId) => {
  const numericUserId = Number(userId);

  if (!Number.isInteger(numericUserId) || numericUserId <= 0) {
    throw new ApiError(400, 'userId trebuie sa fie un numar intreg pozitiv');
  }

  const reviewedUser = await userRepository.findUserById(numericUserId);
  if (!reviewedUser) {
    throw new ApiError(404, 'Utilizatorul cautat nu exista');
  }

  return reviewRepository.getReviewsForUser(numericUserId);
};

module.exports = {
  createReview,
  getReviewsForUser,
};
