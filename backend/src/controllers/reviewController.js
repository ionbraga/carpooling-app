const reviewService = require('../services/reviewService');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');

const createReview = asyncHandler(async (req, res) => {
  const { reviewed_user_id, rating, comment } = req.body;

  const review = await reviewService.createReview(req.user.id, reviewed_user_id, rating, comment);

  return successResponse(res, 201, 'Review-ul a fost creat cu succes', review);
});

const getReviewsForUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const reviews = await reviewService.getReviewsForUser(userId);

  return successResponse(res, 200, 'Review-urile utilizatorului au fost preluate cu succes', reviews);
});

module.exports = {
  createReview,
  getReviewsForUser,
};
