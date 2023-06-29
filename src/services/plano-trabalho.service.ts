import { useQuery } from 'react-query';
import { api } from './api';

export type IGetWorkPlan = {
  search: string;
  page: number;
  limit: number;
  order: string;
  status: string;
  referenceYear: number;
};

export type IGetWorkPlanActions = {
  search: string;
  page: number;
  limit: number;
  order: string;
  status: string;
  month: number;
  year: number;
};

export type ISchedule = {
  id?: string;
  month: number;
  year: number;
  action: string;
  isFormer: boolean;
};

export type IWorkPlan = {
  justification: string;
  generalObjectives: string;
  specificObjectives: string;
  schedules: ISchedule[];
};

export type IWorkPlanPage = {
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
  justification: string;
  generalObjectives: string;
  specificObjectives: string;
  sendValidationAt: string;
  validationAt: string;
  scholar: {
    name: string;
    cpf: string;
  };
  schedules?: ISchedule[];
};

export type IAction = {
  action: string;
  createdAt: string;
  id: number;
  month: number;
  status: string;
  updatedAt: string;
  year: number;
};

export function useGetWorkPlans(
  params: IGetWorkPlan,
  enabled = true as boolean,
) {
  const { data, isLoading } = useQuery({
    queryKey: ['work-plans', params],
    queryFn: async () => {
      const resp = await api
        .get(`/work-plans`, {
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
      return resp?.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes,
    enabled: enabled,
  });

  return {
    data,
    isLoading,
  };
}

export function useGetWorkPlansGeneral(
  params: IGetWorkPlan,
  enabled = true as boolean,
) {
  const { data, isLoading } = useQuery({
    queryKey: ['work-plans-general', params],
    queryFn: async () => {
      const resp = await api
        .get(`/work-plans/general-search`, {
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
      return resp?.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes,
    enabled: enabled,
  });

  return {
    data,
    isLoading,
  };
}

export async function getWorkPlans(params: IGetWorkPlan) {
  const resp = await api
    .get(`/work-plans`, {
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

export async function createWorkPlan(data: IWorkPlan) {
  const response = await api
    .post(`/work-plans`, data)
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

export async function sendWorkPlan(id: number) {
  return api
    .post(`/work-plans/${id}`)
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

export async function editWorkPlan(id: number, data: IWorkPlan) {
  return api
    .patch(`/work-plans/${id}`, data)
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

export async function getWorkPlan(id: number) {
  return api
    .get(`/work-plans/${id}`)
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

export async function getWorkPlanActions(params: IGetWorkPlanActions) {
  return api
    .get(`/work-plans/actions`, { params })
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

export async function getMyWorkPlan() {
  return api
    .get(`/work-plans/user/me`)
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

export async function deleteWorkPlan(id: number) {
  return api
    .delete(`/work-plans/${id}`)
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

export async function createSchedule(id, data: ISchedule) {
  const response = await api
    .post(`/work-plans/${id}/schedule`, data)
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

export async function editSchedule(id: number, data: ISchedule) {
  const response = await api
    .patch(`/work-plans/schedule/${id}`, data)
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

export async function deleteSchedule(id) {
  const response = await api
    .delete(`/work-plans/schedule/${id}`)
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

export async function reproveWorkPlan(id: number, data) {
  return api
    .patch(`/work-plans/${id}/reprove`, data)
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

export async function approveWorkPlan(id: number) {
  return api
    .patch(`/work-plans/${id}/approve`)
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

export async function updateWorkPlan(id: number) {
  return api
    .patch(`/work-plans/${id}/in-validation`)
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
