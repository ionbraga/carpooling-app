const reviewRepository = require('../repositories/reviewRepository');
const userRepository = require('../repositories/userRepository');
const ApiError = require('../utils/ApiError');
const { isPositiveInteger } = require('../utils/validators');

const createReview = async (reviewerId, reviewedUserId, rating, comment = '') => {
  if (!reviewedUserId || !rating) {
    throw new ApiError(400, 'Utilizatorul evaluat si ratingul sunt obligatorii');
  }

  const numericReviewedUserId = Number(reviewedUserId);
  const numericRating = Number(rating);

  if (!isPositiveInteger(numericReviewedUserId)) {
    throw new ApiError(400, 'ID-ul utilizatorului evaluat este invalid');
  }

  if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
    throw new ApiError(400, 'Ratingul trebuie sa fie un numar intreg intre 1 si 5');
  }

  if (Number(reviewerId) === numericReviewedUserId) {
    throw new ApiError(400, 'Nu poti lasa review propriului cont');
  }

  const reviewedUser = await userRepository.findUserById(numericReviewedUserId);

  if (!reviewedUser) {
    throw new ApiError(404, 'Utilizatorul evaluat nu exista');
  }

  const completedRide = await reviewRepository.findCompletedConfirmedRideWithDriver(
    reviewerId,
    numericReviewedUserId
  );

  if (!completedRide) {
    throw new ApiError(
      403,
      'Poti lasa review doar dupa o cursa confirmata si finalizata cu acest sofer'
    );
  }

  const existingReview = await reviewRepository.findExistingReview(
    reviewerId,
    numericReviewedUserId
  );

  if (existingReview) {
    throw new ApiError(409, 'Ai lasat deja un review pentru acest utilizator');
  }

  const normalizedComment = String(comment ?? '').trim();

  if (normalizedComment.length > 500) {
    throw new ApiError(400, 'Comentariul poate avea maximum 500 de caractere');
  }

  return reviewRepository.createReview(
    reviewerId,
    numericReviewedUserId,
    numericRating,
    normalizedComment
  );
};

const getReviewsForUser = async (userId) => {
  const numericUserId = Number(userId);

  if (!isPositiveInteger(numericUserId)) {
    throw new ApiError(400, 'ID-ul utilizatorului este invalid');
  }

  const user = await userRepository.findUserById(numericUserId);

  if (!user) {
    throw new ApiError(404, 'Utilizatorul nu exista');
  }

  return reviewRepository.getReviewsForUser(numericUserId);
};

module.exports = {
  createReview,
  getReviewsForUser,
};