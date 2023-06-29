import { api } from './api';

export async function getAllAreas() {
  return api.get(`/profile/areas/all`);
}
