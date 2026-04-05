# Carpooling Backend

Backend REST API pentru o aplicatie de carpooling, realizat cu Node.js, Express, PostgreSQL si JWT.

## Functionalitati implementate

- inregistrare utilizatori
- autentificare cu JWT
- creare si listare curse
- creare rezervari cu tranzactie in baza de date
- prevenire rezervari duplicate
- prevenire rezervari in propria cursa
- creare review-uri
- prevenire review-uri duplicate
- tratare centralizata a erorilor
- raspunsuri JSON standardizate

## Structura arhitecturala

- `routes` - definirea endpoint-urilor
- `controllers` - gestionarea request/response
- `services` - logica de business
- `repositories` - accesul la PostgreSQL
- `middleware` - autentificare, 404, erori
- `utils` - utilitare comune

## Instalare

```bash
npm install
```

## Configurare

1. copiaza `.env.example` in `.env`
2. completeaza valorile pentru baza de date si JWT
3. ruleaza scriptul SQL din `sql/schema.sql`

## Pornire

```bash
npm run dev
```

sau

```bash
npm start
```

## Endpoint-uri disponibile

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Rides
- `POST /api/rides`
- `GET /api/rides`
- `GET /api/rides?origin=Chisinau&destination=Balti&only_available=true`

### Bookings
- `POST /api/bookings`
- `GET /api/bookings/my`

### Reviews
- `POST /api/reviews`
- `GET /api/reviews/user/:userId`

## Exemplu header autorizare

```http
Authorization: Bearer <token>
```
