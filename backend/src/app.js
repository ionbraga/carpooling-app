const express = require('express');
const cors = require('cors');

const env = require('./config/env');
const authRoutes = require('./routes/authRoutes');
const rideRoutes = require('./routes/rideRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const notFoundHandler = require('./middleware/notFoundHandler');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(
  cors({
    origin: env.corsOrigin,
    credentials: true,
  })
);
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API-ul backend pentru aplicatia de carpooling functioneaza corect.',
    data: {
      version: '1.0.0',
    },
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
