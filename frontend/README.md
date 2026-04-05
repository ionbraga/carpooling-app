# RideTogether Frontend

Frontend React modern pentru aplicatia de carpooling. Este construit sa functioneze direct cu backend-ul Node.js + Express + PostgreSQL deja pregatit in proiect.

## Tehnologii

- React 18
- Vite
- React Router DOM
- Axios
- CSS modern, organizat pe componente si layout-uri

## Pattern-uri si decizii arhitecturale

Acest frontend respecta o structura clara, potrivita pentru o prezentare academica:

- **Component-Based Architecture**: interfata este impartita in componente reutilizabile.
- **Service Layer Pattern**: comunicarea cu backend-ul este izolata in `src/api`.
- **Context Pattern**: autentificarea si notificarile globale sunt gestionate prin `AuthContext` si `NotificationContext`.
- **Route Guard Pattern**: rutele protejate si cele publice sunt controlate prin `ProtectedRoute` si `PublicOnlyRoute`.
- **Separation of Concerns**: paginile, componentele, hook-urile, utilitarele si stilurile sunt separate logic.

## Functionalitati

- pagina principala moderna
- autentificare si inregistrare
- pastrarea sesiunii in `localStorage`
- listare curse
- filtrare curse dupa origine, destinatie si disponibilitate
- creare cursa
- rezervare cursa prin modal
- pagina cu rezervarile proprii
- pagina review-uri pentru un utilizator
- creare review
- notificari globale pentru succes si eroare
- interfata responsive

## Structura proiectului

```text
src/
  api/
  app/
  components/
    common/
    layout/
    rides/
    reviews/
  context/
  hooks/
  pages/
  styles/
  utils/
```

## Pornire proiect

### 1. Instaleaza dependintele

```bash
npm install
```

### 2. Configureaza variabilele de mediu

Copiaza fisierul `.env.example` intr-un fisier nou numit `.env`.

Exemplu:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Porneste aplicatia

```bash
npm run dev
```

Frontend-ul va rula implicit la:

```text
http://localhost:5173
```

## Backend necesar

Backend-ul trebuie sa fie pornit separat pe `http://localhost:5000` si sa aiba rutele:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/rides`
- `POST /api/rides`
- `POST /api/bookings`
- `GET /api/bookings/my`
- `POST /api/reviews`
- `GET /api/reviews/user/:userId`

## Flux recomandat pentru demonstratie

1. inregistrare utilizator 1
2. autentificare utilizator 1
3. publicare cursa
4. inregistrare utilizator 2
5. autentificare utilizator 2
6. rezervare cursa din lista
7. accesare pagina de review-uri pentru sofer
8. publicare review
9. verificare rezervari in pagina "Rezervarile mele"

## Observatii

- Token-ul JWT este trimis automat prin interceptor Axios.
- Frontend-ul afiseaza mesajele de eroare primite din backend.
- Daca vrei, poate fi extins usor cu dashboard, profil utilizator, editare cursa sau anulare booking.
