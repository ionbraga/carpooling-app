import { httpClient } from './httpClient';

export const authService = {
  async register(payload) {
    const { data } = await httpClient.post('/auth/register', payload);
    return data;
  },

  async login(payload) {
    const { data } = await httpClient.post('/auth/login', payload);
    return data;
  },
};
