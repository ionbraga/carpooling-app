const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(String(email).trim().toLowerCase());
};

const isPositiveInteger = (value) => Number.isInteger(Number(value)) && Number(value) > 0;

const isValidDate = (value) => {
  const date = new Date(value);
  return !Number.isNaN(date.getTime());
};

const normalizeText = (value) => String(value).trim();

module.exports = {
  isValidEmail,
  isPositiveInteger,
  isValidDate,
  normalizeText,
};
