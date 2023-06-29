import { api } from './api';
import { useQuery } from 'react-query';

export type IRegional = {
  id: number;
  name: string;
  abbreviation: string;
  cep: string;
  neighborhood: string;
  street: string;
  numberAddress: string;
  complement: string;
  cities: string[];
  active: boolean;
};

export type IContractForm = {
  scholarId: number;
  project: string;
  workUnit: string;
  city: string;
  contractDescription: string;
  axle: string;
  startDate: Date;
  endDate: Date;
  extensionDate: Date;
  payingSource: string;
  bagName: string;
  weekHours: number;
  scholarshipValue: number;
};

export type IGetContract = {
  search?: string;
  page: number;
  limit: number;
  order: string;
  status?: number;
  column?: string;
  city: string;
};

export function useGetContract(
  params: IGetContract,
  enabled = true as boolean,
) {
  const { data, isLoading } = useQuery({
    queryKey: ['contracts', params],
    queryFn: async () => {
      const resp = await api
        .get(`/terms-of-membership`, {
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

export function useGetContractGeneralSearch(
  params: IGetContract,
  enabled = true as boolean,
) {
  const { data, isLoading } = useQuery({
    queryKey: ['contracts-general', params],
    queryFn: async () => {
      const resp = await api
        .get(`/terms-of-membership/general-search`, {
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

export async function createContract(data: IContractForm) {
  const response = await api
    .post(`/terms-of-membership`, data)
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
  return response;
}

export async function editContract(id: number, data: IContractForm) {
  return api
    .put(`${process.env.NEXT_PUBLIC_API_URL}/terms-of-membership/${id}`, data)
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

export async function getContract(id: number) {
  return api
    .get(`/terms-of-membership/${id}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log('error: ', error);
      return {
        status: 401,
        data: {
          message: error?.response?.data?.message,
        },
      };
    });
}

export async function inactvateContract(id: number) {
  return api
    .patch(`/terms-of-membership/${id}/inactivate`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log('error: ', error);
      return {
        status: 401,
        data: {
          message: error?.response?.data?.message,
        },
      };
    });
}

export async function getMyContract() {
  return api
    .get(`/terms-of-membership/me`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log('error: ', error);
      return {
        status: 401,
        data: {
          message: error?.response?.data?.message,
        },
      };
    });
}

export async function signMyContract(data: FormData) {
  return api
    .patch(`/terms-of-membership/me/to-sign`, data, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log('error: ', error);
      return {
        status: 401,
        data: {
          message: error?.response?.data?.message,
        },
      };
    });
}

export async function cancelMyContract(data: FormData) {
  return api
    .patch(`/terms-of-membership/me/to-cancel`, data, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log('error: ', error);
      return {
        status: 401,
        data: {
          message: error?.response?.data?.message,
        },
      };
    });
}
