export function validateRegisterForm(values) {
  if (!values.name.trim()) return 'Numele este obligatoriu.';
  if (values.name.trim().length < 2) return 'Numele trebuie sa aiba cel putin 2 caractere.';
  if (!values.email.trim()) return 'Email-ul este obligatoriu.';
  if (!/^\S+@\S+\.\S+$/.test(values.email)) return 'Email-ul nu este valid.';
  if (!values.password) return 'Parola este obligatorie.';
  if (values.password.length < 6) return 'Parola trebuie sa aiba cel putin 6 caractere.';
  return null;
}

export function validateLoginForm(values) {
  if (!values.email.trim()) return 'Email-ul este obligatoriu.';
  if (!values.password) return 'Parola este obligatorie.';
  return null;
}

export function validateRideForm(values) {
  if (!values.origin.trim()) return 'Originea este obligatorie.';
  if (!values.destination.trim()) return 'Destinatia este obligatorie.';
  if (!values.departure_time) return 'Data si ora plecarii sunt obligatorii.';
  if (Number(values.available_seats) <= 0) return 'Locurile disponibile trebuie sa fie mai mari decat 0.';
  if (Number(values.price) < 0) return 'Pretul nu poate fi negativ.';
  return null;
}

export function validateBookingForm(values) {
  if (!values.seats_booked) return 'Numarul de locuri este obligatoriu.';
  if (Number(values.seats_booked) <= 0) return 'Numarul de locuri trebuie sa fie mai mare decat 0.';
  return null;
}

export function validateReviewForm(values) {
  if (!values.rating) return 'Ratingul este obligatoriu.';
  if (Number(values.rating) < 1 || Number(values.rating) > 5) {
    return 'Ratingul trebuie sa fie intre 1 si 5.';
  }
  if (values.comment.length > 500) return 'Comentariul poate avea maximum 500 de caractere.';
  return null;
}
