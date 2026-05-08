const userService = require('../services/userService');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');

const getMe = asyncHandler(async (req, res) => {
  const profile = await userService.getMyProfile(req.user.id);

  return successResponse(res, 200, 'Profilul utilizatorului a fost preluat cu succes', profile);
});

const updateMe = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const user = await userService.updateMyProfile(req.user.id, name);

  return successResponse(res, 200, 'Profilul a fost actualizat cu succes', {
    user,
  });
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;

  await userService.changeMyPassword(
    req.user.id,
    currentPassword,
    newPassword,
    confirmNewPassword
  );

  return successResponse(res, 200, 'Parola a fost schimbata cu succes');
});

module.exports = {
  getMe,
  updateMe,
  changePassword,
};