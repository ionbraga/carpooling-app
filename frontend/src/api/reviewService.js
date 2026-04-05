import { httpClient } from './httpClient';

export const reviewService = {
  async getByUser(userId) {
    const { data } = await httpClient.get(`/reviews/user/${userId}`);
    return data;
  },

  async create(payload) {
    const { data } = await httpClient.post('/reviews', payload);
    return data;
  },
};
