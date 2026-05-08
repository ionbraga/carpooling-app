import { moldovaCities } from '../data/moldovaCities';

const normalizeText = (value) => String(value ?? '').trim();

const normalizeCity = (value) =>
  normalizeText(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ');

const moldovaCityKeys = new Set(moldovaCities.map((city) => normalizeCity(city)));

const isKnownMoldovaCity = (city) => moldovaCityKeys.has(normalizeCity(city));

const isValidEmail = (email) => {
  const value = normalizeText(email).toLowerCase();

  if (!value) return false;
  if (value.length > 254) return false;
  if (/\s/.test(value)) return false;
  if ((value.match(/@/g) || []).length !== 1) return false;
  if (value.includes('..')) return false;

  return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(value);
};

const isValidName = (name) => {
  const value = normalizeText(name);

  if (value.length < 2 || value.length > 50) return false;

  return /^[A-Za-zĂÂÎȘȚăâîșț' -]+$/u.test(value);
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

export function validateRegisterForm(values) {
  const name = normalizeText(values.name);
  const email = normalizeText(values.email).toLowerCase();
  const password = values.password;
  const confirmPassword = values.confirmPassword;

  if (!name) return 'Numele este obligatoriu.';

  if (!isValidName(name)) {
    return 'Numele trebuie să aibă 2-50 caractere și poate conține doar litere, spații, cratimă sau apostrof.';
  }

  if (!email) return 'Email-ul este obligatoriu.';

  if (!isValidEmail(email)) {
    return 'Introdu o adresă de email validă. Exemplu: nume@gmail.com.';
  }

  if (!password) return 'Parola este obligatorie.';

  if (!isStrongPassword(password)) {
    return 'Parola trebuie să aibă 8-64 caractere, o literă mare, o literă mică și o cifră, fără spații.';
  }

  if (
    password.toLowerCase() === email ||
    password.toLowerCase().includes(email.split('@')[0])
  ) {
    return 'Parola nu trebuie să conțină emailul.';
  }

  if (!confirmPassword) return 'Confirmarea parolei este obligatorie.';

  if (password !== confirmPassword) {
    return 'Parolele nu coincid.';
  }

  return null;
}

export function validateLoginForm(values) {
  if (!normalizeText(values.email)) return 'Email-ul este obligatoriu.';
  if (!values.password) return 'Parola este obligatorie.';
  return null;
}

export function validateRideForm(values) {
  const origin = normalizeText(values.origin);
  const destination = normalizeText(values.destination);
  const departureTime = values.departure_time;
  const seats = Number(values.available_seats);
  const price = Number(values.price);

  if (!origin) return 'Originea este obligatorie.';

  if (origin.length < 2 || origin.length > 50) {
    return 'Originea trebuie să conțină între 2 și 50 de caractere.';
  }

  if (!isKnownMoldovaCity(origin)) {
    return 'Alege originea din lista de localități disponibile din Republica Moldova.';
  }

  if (!destination) return 'Destinația este obligatorie.';

  if (destination.length < 2 || destination.length > 50) {
    return 'Destinația trebuie să conțină între 2 și 50 de caractere.';
  }

  if (!isKnownMoldovaCity(destination)) {
    return 'Alege destinația din lista de localități disponibile din Republica Moldova.';
  }

  if (normalizeCity(origin) === normalizeCity(destination)) {
    return 'Originea și destinația nu pot fi aceleași.';
  }

  if (!departureTime) return 'Data și ora plecării sunt obligatorii.';

  const selectedDate = new Date(departureTime);

  if (Number.isNaN(selectedDate.getTime())) {
    return 'Data și ora plecării nu sunt valide.';
  }

  const minimumAllowedDate = new Date(Date.now() + 10 * 60 * 1000);

  if (selectedDate < minimumAllowedDate) {
    return 'Data plecării trebuie să fie cu cel puțin 10 minute în viitor.';
  }

  if (values.available_seats === '' || values.available_seats === null) {
    return 'Numărul de locuri este obligatoriu.';
  }

  if (!Number.isInteger(seats)) {
    return 'Numărul de locuri trebuie să fie un număr întreg.';
  }

  if (seats < 1) {
    return 'Numărul de locuri trebuie să fie cel puțin 1.';
  }

  if (seats > 8) {
    return 'Numărul de locuri nu poate fi mai mare de 8.';
  }

  if (values.price === '' || values.price === null) {
    return 'Prețul este obligatoriu.';
  }

  if (Number.isNaN(price)) {
    return 'Prețul trebuie să fie un număr valid.';
  }

  if (price < 0) {
    return 'Prețul nu poate fi negativ.';
  }

  if (price > 5000) {
    return 'Prețul nu poate depăși 5000 MDL.';
  }

  return null;
}

export function validateBookingForm(values) {
  if (!values.seats_booked) return 'Numărul de locuri este obligatoriu.';
  if (Number(values.seats_booked) <= 0) {
    return 'Numărul de locuri trebuie să fie mai mare decât 0.';
  }

  return null;
}

export function validateReviewForm(values) {
  if (!values.rating) return 'Ratingul este obligatoriu.';

  if (Number(values.rating) < 1 || Number(values.rating) > 5) {
    return 'Ratingul trebuie să fie între 1 și 5.';
  }

  if (values.comment.length > 500) {
    return 'Comentariul poate avea maximum 500 de caractere.';
  }

  return null;
}

const normalizeProfileText = (value) => String(value ?? '').trim();

const isValidProfileName = (name) => {
  const value = normalizeProfileText(name);

  if (value.length < 2 || value.length > 50) {
    return false;
  }

  return /^[A-Za-zĂÂÎȘȚăâîșț' -]+$/u.test(value);
};

const isStrongProfilePassword = (password) => {
  const value = String(password ?? '');

  if (value.length < 8 || value.length > 64) return false;
  if (/\s/.test(value)) return false;
  if (!/[a-z]/.test(value)) return false;
  if (!/[A-Z]/.test(value)) return false;
  if (!/[0-9]/.test(value)) return false;

  return true;
};

export function validateProfileForm(values) {
  const name = normalizeProfileText(values.name);

  if (!name) {
    return 'Numele este obligatoriu.';
  }

  if (!isValidProfileName(name)) {
    return 'Numele trebuie să aibă 2-50 caractere și poate conține doar litere, spații, cratimă sau apostrof.';
  }

  return null;
}

export function validateChangePasswordForm(values) {
  if (!values.currentPassword) {
    return 'Parola actuală este obligatorie.';
  }

  if (!values.newPassword) {
    return 'Parola nouă este obligatorie.';
  }

  if (!isStrongProfilePassword(values.newPassword)) {
    return 'Parola nouă trebuie să aibă 8-64 caractere, o literă mare, o literă mică și o cifră, fără spații.';
  }

  if (!values.confirmNewPassword) {
    return 'Confirmarea parolei noi este obligatorie.';
  }

  if (values.newPassword !== values.confirmNewPassword) {
    return 'Parola nouă și confirmarea nu coincid.';
  }

  if (values.currentPassword === values.newPassword) {
    return 'Parola nouă trebuie să fie diferită de parola actuală.';
  }

  return null;
}