import axios, { AxiosError, AxiosInstance } from 'axios';
import { signOutt } from 'src/context/AuthContext';
import { parseCookies } from '../utils/cookies';

const cookies = parseCookies();


export function setupAPIClient(): {
  api: AxiosInstance;
} {
  const api = axios.create({
    baseURL:
      process.env.NEXT_PUBLIC_API_URL,
    headers: {
      Authorization: `Bearer ${cookies['__session']}`,
      // Authorization: `Bearer ${cookies["__session"]}`,
    },
  });
  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: AxiosError) => {
      if (
        error?.response?.status === 401 &&
        error?.response?.statusText === 'Unauthorized'
      ) {
        signOutt();
      }
      return Promise.reject(error);
    },
  );
  return {
    api,
  };
}
export const { api } = setupAPIClient();
