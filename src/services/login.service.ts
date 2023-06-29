import axios from 'axios';
import { api } from './api';

export async function confirmarNovaSenhaRequest(
  token: string | string[],
  password: string,
) {
  const response = await axios
    .post(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
      token,
      password,
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log('error: ', error);
      return {
        status: 401,
        data: {
          message:
            'Link de redefinição de senha expirado. Por favor, solicite outro.',
        },
      };
    });
  return response;
}

export async function confirmarNovaSenhaRequestLogged(
  password: string,
  currentPassword: string,
) {
  return api
    .patch(`${process.env.NEXT_PUBLIC_API_URL}/users/change-password`, {
      password,
      currentPassword,
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return {
        status: 400,
        data: {
          message: error.response.data.message,
        },
      };
    });
}

export async function recuperarSenhaRequest(
  email: string,
  idPartnerState: number,
) {
  axios
    .post(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password/state`, {
      email,
      idPartnerState,
    })
    .then((response) => {
      console.log('response: ', response);
    })
    .catch((error) => {
      console.log('error: ', error);
    });
}
