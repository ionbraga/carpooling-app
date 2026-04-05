import { httpClient } from './httpClient';
import { buildQueryString } from '../utils/buildQueryString';

export const rideService = {
  async getAll(filters = {}) {
    const queryString = buildQueryString(filters);
    const { data } = await httpClient.get(`/rides${queryString}`);
    return data;
  },

  async create(payload) {
    const { data } = await httpClient.post('/rides', payload);
    return data;
  },
};
