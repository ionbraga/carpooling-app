import { httpClient } from './httpClient';

export const userService = {
  async getMe() {
    const { data } = await httpClient.get('/users/me');
    return data;
  },

  async updateMe(payload) {
    const { data } = await httpClient.put('/users/me', payload);
    return data;
  },

  async changePassword(payload) {
    const { data } = await httpClient.put('/users/me/password', payload);
    return data;
  },
};