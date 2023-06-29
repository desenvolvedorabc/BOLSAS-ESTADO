/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from 'react-query';
import { api } from './api';
import { getBase64 } from 'src/utils/get-base64';

export type IUserForm = {
  name: string;
  email: string;
  telephone: string;
  cpf: string;
  idPartnerState?: number;
  city?: string;
  idRegional?: number;
  idAccessProfile?: number;
  active?: boolean;
  image_profile?: string;
};

export type IGetUser = {
  search: string;
  page: number;
  limit: number;
  order: string;
  status: string;
  profile?: string;
  role?: 'PARC' | 'ESTADO';
  partnerState?: number;
  idRegionalPartner?: number;
  city?: string;
  profileType?: string;
};

export async function getUsers(params: IGetUser) {
  params = {
    ...params,
    role: params.role ? params.role : 'PARC',
  };
  // const resp = await axios.get("/api/user", { params });
  const resp = await api
    .get(`/users`, {
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
          message: 'Erro ao pesquisar usuários',
        },
      };
    });
  return resp;
}

export function useGetUsers(params: IGetUser, enabled = true as boolean) {
  const { data, isLoading } = useQuery({
    queryKey: ['users', params],
    queryFn: async () => {
      const resp = await api
        .get(`/users`, {
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

export function useGetUsersGeneralSearch(
  params: IGetUser,
  enabled = true as boolean,
) {
  const { data, isLoading } = useQuery({
    queryKey: ['users-general', params],
    queryFn: async () => {
      const resp = await api
        .get(`/users/general/search`, {
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

export async function getUsersGeneralSearch(params: IGetUser) {
  params = {
    ...params,
    role: params.role ? params.role : 'PARC',
  };
  const resp = await api
    .get(`/users/general/search`, {
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
          message: 'Erro ao pesquisar usuários',
        },
      };
    });
  return resp;
}

export function useGetUsersNotifications(
  params: IGetUser,
  enabled = true as boolean,
) {
  const { data, isLoading } = useQuery({
    queryKey: ['users-notifications', params],
    queryFn: async () => {
      const resp = await api
        .get(`/users/notifications`, {
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

export async function createUser(data: IUserForm, avatar: any) {
  const response = await api
    .post(`/users/state`, data)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log('error: ', error);
      return {
        status: 400,
        data: {
          message: error.response.data.message,
        },
      };
    });
  if (avatar !== null) {
    const result = await getBase64(avatar);

    await api.post(`/users/avatar/upload`, {
      id: response.data.id,
      filename: avatar.name,
      base64: result,
    });

    // if (respAvatar.data?.status != 401) data.image_profile = respAvatar.data;
  }
  // if (avatar && avatar.getAll('avatar').length > 0) {
  //   await api.post(`/users/avatar/upload/${response.data.id}`, avatar, {
  //     headers: {
  //       Accept: 'application/json',
  //       'Content-Type': 'multipart/form-data',
  //     },
  //   });
  // }
  return response;
}

export async function editUser(
  id: number,
  data: IUserForm,
  avatar: any,
  changeScholarship: boolean,
  isFormer: boolean,
) {
  if (avatar !== null) {
    const result = await getBase64(avatar);

    const respAvatar = await api.post(`/users/avatar/upload`, {
      id: id,
      filename: avatar.name,
      base64: result,
    });

    if (respAvatar.data?.status != 401) data.image_profile = respAvatar.data;
  }

  const responseUpdate = await api
    .put(`/users/state/${id}`, data)
    .then(async (response) => {
      if (changeScholarship) {
        const responseUpdate = await api
          .post(`/scholars/${id}/change-admin-for-scholar`, { isFormer })
          .then((response) => {
            return response;
          })
          .catch((error) => {
            console.log('error: ', error);
            return {
              status: 400,
              data: {
                message: error.response.data.message,
              },
            };
          });
        return responseUpdate;
      }
      if (responseUpdate?.data.message) return responseUpdate;
      return response;
    })
    .catch((error) => {
      console.log('error: ', error);
      return {
        status: 400,
        data: {
          message: error.response.data.message,
        },
      };
    });
  return responseUpdate;
}

export async function inactivateUser(id: number) {
  const resp = await api
    .put(`/users/${id}/inactivate`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log('error: ', error);
      return {
        status: 400,
        data: {
          message: error.response.data.message,
        },
      };
    });
  return resp;
}

export async function getUser(id: number) {
  const resp = await api
    .get(`/users/${id}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log('error: ', error);
      return {
        status: 400,
        data: {
          message: error.response.data.message,
        },
      };
    });
  return resp;
}

export function useGetUser(id, url) {
  const { data, isLoading } = useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      const response = await api
        .get(`/users/${id}`)
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

      return {
        ...response.data,
        image_profile_url: `${url}/users/avatar/${response.data?.image_profile}`,
      };
    },
    staleTime: 1000 * 60,
  });

  return {
    data,
    isLoading,
  };
}

export async function resendEmailPassword(id: number) {
  const response = await api.post(`/users/welcome-reset-password/${id}`);
  return response.data;
}

export async function getExportUsersExcel(params: IGetUser) {
  return api.get(`/users/reports/excel`, {
    params,
    responseType: 'blob',
  });
}

export async function getExportUsersStateExcel(params: IGetUser) {
  return api.get(`/users/state/reports/excel`, {
    params,
    responseType: 'blob',
  });
}
