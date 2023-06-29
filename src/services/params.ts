import { api } from './api';

export type IParams = {
  dayLimitForMonthlyReport: number;
  daysLimitForAnalysisMonthlyReport: number;
  daysLimitSendNotificationForMonthlyReport: number;
};

export async function getParamsMe() {
  const resp = api
    .get(`/system-parameters/me`)
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

  return resp;
}

export async function createParam(data: IParams) {
  const response = await api
    .post(`/system-parameters`, data)
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
  return response;
}

export async function editParam(data: IParams) {
  const response = await api
    .patch(`/system-parameters/me`, data)
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
  return response;
}
