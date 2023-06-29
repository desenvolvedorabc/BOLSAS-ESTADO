/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from 'react-query';
import { api } from './api';

export type IGetMonthReport = {
  search: string;
  page: number;
  limit: number;
  order: string;
  status: string;
  year?: number;
  month: number;
};

export type IResult = {
  detailingResult: string;
  workloadInMinutes: number;
  qntExpectedGraduates: number;
  qntFormedGifts: number;
  trainingModality: string;
  trainingDate: string;
};

export type IActionResult = {
  id: number;
  scheduleWorkPlanId: number;
  detailing: string;
  workloadInMinutes: number;
  qntExpectedGraduates: number;
  qntFormedGifts: number;
  trainingModality: string;
  status: string;
};

export type IMonthReport = {
  month: number;
  year: number;
  actions: any[];
  file: FormData;
};

export type IMonthReportPage = {
  id: number;
  createdAt: string;
  updatedAt: string;
  status: string;
  project: string;
  workUnit: string;
  city: string;
  startDate: string;
  endDate: string;
  justificationReprove: string;
  sendValidationAt: string;
  validationAt: string;
  scholar: {
    name: string;
  };
};

export function useGetApproveMonthReports(
  params: IGetMonthReport,
  enabled = true as boolean,
) {
  const { data, isLoading } = useQuery({
    queryKey: ['approve_monthly_reports', params],
    queryFn: async () => {
      const resp = await api
        .get(`/monthly-reports`, {
          params,
        })
        .then((response) => {
          return response;
        })
        .catch((error) => {
          console.log('error: ', error);
          return {
            status: 400,
            data: {
              message: error?.response?.data?.message,
            },
          };
        });
      return resp.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes,
    enabled: enabled,
  });

  return {
    data,
    isLoading,
  };
}

export function useGetMonthReportsGeneralSearch(
  params: IGetMonthReport,
  enabled = true as boolean,
) {
  const { data, isLoading } = useQuery({
    queryKey: ['monthly_reports_general', params],
    queryFn: async () => {
      const resp = await api
        .get(`/monthly-reports/general-search`, {
          params,
        })
        .then((response) => {
          return response;
        })
        .catch((error) => {
          console.log('error: ', error);
          return {
            status: 400,
            data: {
              message: error?.response?.data?.message,
            },
          };
        });
      return resp.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes,
    enabled: enabled,
  });

  return {
    data,
    isLoading,
  };
}

export function useGetMonthReportsMe(
  params: IGetMonthReport,
  enabled = true as boolean,
) {
  const { data, isLoading } = useQuery({
    queryKey: ['monthly_reports_me', params],
    queryFn: async () => {
      const resp = await api
        .get(`/monthly-reports/me`, {
          params,
        })
        .then((response) => {
          return response;
        })
        .catch((error) => {
          console.log('error: ', error);
          return {
            status: 400,
            data: {
              message: error?.response?.data?.message,
            },
          };
        });
      return resp.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes,
    enabled: enabled,
  });

  return {
    data,
    isLoading,
  };
}

export async function getMonthReports(params: IGetMonthReport) {
  const resp = await api
    .get(`/monthly-reports`, {
      params,
    })
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
  console.log(resp);

  return resp;
}

export async function createMonthReport(data: IMonthReport) {
  const response = await api
    .post(`/monthly-reports`, data)
    .then(async (response) => {
      console.log('response: ', response);

      if (data.file) {
        const responseFile = await api
          .patch(
            `/monthly-reports/${response?.data?.monthlyReport?.id}/add-file`,
            data.file,
            {
              headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
              },
            },
          )
          .then((responseFile) => {
            console.log('responseFile: ', responseFile);
            return responseFile;
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

export async function sendMonthReport(id: number) {
  return api
    .patch(`/monthly-reports/${id}/send-for-validation`)
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

export async function editMonthReport(id: number, data: IMonthReport) {
  return api
    .put(`/monthly-reports/${id}`, data)
    .then(async (response) => {
      console.log('response: ', response);
      if (data.file) {
        const responseFile = await api
          .patch(`/monthly-reports/${id}/add-file`, data.file, {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'multipart/form-data',
            },
          })
          .then((responseFile) => {
            console.log('responseFile: ', responseFile);
            return responseFile;
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

export async function getMonthReport(id: number) {
  return api
    .get(`/monthly-reports/${id}`)
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

export async function deleteMonthReport(id: number) {
  return api
    .delete(`/monthly-reports/${id}`)
    .then((response) => {
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

export async function reproveMonthReport(id: number, data) {
  return api
    .patch(`/monthly-reports/${id}/reprove`, data)
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

export async function approveMonthReport(id: number) {
  return api
    .patch(`/monthly-reports/${id}/approve`)
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

export async function updateMonthReport(id: number) {
  return api
    .patch(`/monthly-reports/${id}/in-validation`)
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
