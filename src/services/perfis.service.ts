import { useQuery } from 'react-query';
import { api } from './api';

export enum ProfileRole {
  BOLSISTA = 'Bolsista',
  ESTADO = 'Estado',
  MUNICIPIO = 'Município',
  REGIONAL = 'Regional',
}

export type IPerfil = {
  id: number;
  name: string;
  areas?: {
    id: number;
    name: string;
    tags: string;
  };
  createdByUser?: {
    id: number;
    name: string;
  };
  active: boolean;
};

export type IGetPerfil = {
  search: string;
  page: number;
  limit: number;
  order: string;
  accessProfileRole: string;
  status: number;
  forApproveScholar: boolean;
  role?: 'ESTADO';
};

export async function getPerfis(
  search: string,
  page: number,
  limit: number,
  order: string,
  accessProfileRole: string,
  status: number,
) {
  const params = {
    search,
    page,
    limit,
    order,
    role: 'ESTADO',
    accessProfileRole,
    status,
  };
  const resp = await api
    .get(`/profile`, {
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

export function useGetPerfis(params: IGetPerfil, enabled = true as boolean) {
  const { data, isLoading } = useQuery({
    queryKey: ['profiles', params],
    queryFn: async () => {
      const resp = await api
        .get(`/profile`, {
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

export async function getPerfisEditUser(
  params: IGetPerfil,
  // search: string,
  // page: number,
  // limit: number,
  // order: string,
  // accessProfileRole: string,
  // status: number,
) {
  // const params = {
  //   search,
  //   page,
  //   limit,
  //   order,
  //   role: 'ESTADO',
  //   accessProfileRole,
  //   status,
  // };
  const resp = await api
    .get(`/profile/for-edit-users`, {
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

export function useGetPerfisGeneralSearch(
  params: IGetPerfil,
  enabled = true as boolean,
) {
  const { data, isLoading } = useQuery({
    queryKey: ['profiles-general', params],
    queryFn: async () => {
      const resp = await api
        .get(`/profile/general/search`, {
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

export async function getPerfisGeneralSearch(
  search: string,
  page: number,
  limit: number,
  order: string,
  accessProfileRole: string,
  status: number,
) {
  const params = {
    search,
    page,
    limit,
    order,
    role: 'ESTADO',
    accessProfileRole,
    status,
  };
  const resp = await api
    .get(`/profile/general/search`, {
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

export async function createPerfil(data: IPerfil) {
  const response = await api
    .post(`/profile`, data)
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

export async function editPerfil(id: number, data: IPerfil) {
  return api
    .put(`/profile/${id}`, data)
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

export async function getPerfil(id: number) {
  return api
    .get(`/profile/${id}`)
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

export function useGetPerfil(id) {
  const { data, isLoading } = useQuery({
    queryKey: ['profile', id],
    queryFn: async () => {
      const response = await api
        .get(`/profile/${id}`)
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

      return response.data;
    },
    staleTime: 1000 * 60,
  });

  return {
    data,
    isLoading,
  };
}
