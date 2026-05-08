const normalizeText = (value) => String(value ?? '').trim();

const isValidEmail = (email) => {
  const normalizedEmail = normalizeText(email).toLowerCase();

  if (!normalizedEmail) return false;
  if (normalizedEmail.length > 254) return false;
  if (/\s/.test(normalizedEmail)) return false;
  if ((normalizedEmail.match(/@/g) || []).length !== 1) return false;
  if (normalizedEmail.includes('..')) return false;

  const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
  return emailRegex.test(normalizedEmail);
};

const isValidName = (name) => {
  const normalizedName = normalizeText(name);

  if (normalizedName.length < 2 || normalizedName.length > 50) {
    return false;
  }

  // Permite litere românești, spații, cratimă și apostrof.
  const nameRegex = /^[A-Za-zĂÂÎȘȚăâîșț' -]+$/u;
  return nameRegex.test(normalizedName);
};

const isStrongPassword = (password) => {
  const value = String(password ?? '');

  if (value.length < 8 || value.length > 64) return false;
  if (/\s/.test(value)) return false;
  if (!/[a-z]/.test(value)) return false;
  if (!/[A-Z]/.test(value)) return false;
  if (!/[0-9]/.test(value)) return false;

  return true;
};

const isPositiveInteger = (value) => Number.isInteger(Number(value)) && Number(value) > 0;

const isValidDate = (value) => {
  const date = new Date(value);
  return !Number.isNaN(date.getTime());
};

module.exports = {
  isValidEmail,
  isValidName,
  isStrongPassword,
  isPositiveInteger,
  isValidDate,
  normalizeText,
};