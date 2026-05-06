import { httpClient } from './httpClient';

export const bookingService = {
  async create(payload) {
    const { data } = await httpClient.post('/bookings', payload);
    return data;
  },

  async getMine() {
    const { data } = await httpClient.get('/bookings/my');
    return data;
  },

  async cancel(bookingId) {
    const { data } = await httpClient.patch(`/bookings/${bookingId}/cancel`);
    return data;
  },
};