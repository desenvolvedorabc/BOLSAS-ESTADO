import { parseCookies } from '../utils/cookies';
import { api } from './api';

const cookies = parseCookies();
const token = cookies['__session'];

export async function getAllNotifications() {
  const params = { token };

  return api.get('/notifications/all', { params });
}

export async function getNotifications(page: number, limit: number) {
  const params = { page, limit };

  return api
    .get('/notifications', { params })
    .then((response) => {
      console.log('response: ', response);
      return response;
    })
    .catch((error) => {
      console.log('error: ', error);
      return {
        status: 401,
        data: {
          message: error.response.data.message,
        },
      };
    });
}

export async function readNotifications(id: number) {
  return api
    .patch(`/notifications/${id}/read`)
    .then((response) => {
      console.log('response: ', response);
      return response;
    })
    .catch((error) => {
      console.log('error: ', error);
      return {
        status: 401,
        data: {
          message: error.response.data.message,
        },
      };
    });
}

export async function deleteNotification(id: string) {
  const data = {
    token,
  };
  return api.delete(`/notifications/${id}`, { data });
}

export async function getNotification(id) {
  return api
    .get(`/notifications/${id}`)
    .then((response) => {
      console.log('response: ', response);
      return response;
    })
    .catch((error) => {
      console.log('error: ', error);
      return {
        status: 401,
        data: {
          message: error.response.data.message,
        },
      };
    });
}
