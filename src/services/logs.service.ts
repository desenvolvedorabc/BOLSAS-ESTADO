import { useQuery } from 'react-query';
import { api } from './api';

type IGetLogs = {
  search: string;
  page: number;
  limit: number;
  column: string;
  order: string;
  initialDate: string;
  finalDate: string;
  method: 'DELETE' | 'POST' | 'PUT';
  entity: string;
  origin: 'ESTADO';
  regionalPartnerId: number;
  city: string;
};

export function useGetLogs(params: IGetLogs, enabled = true as boolean) {
  const { data, isLoading } = useQuery({
    queryKey: ['logs', params],
    queryFn: async () => {
      const resp = await api
        .get(`/system-logs`, {
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

export async function getLogs(
  search: string,
  page: number,
  limit: number,
  column: string,
  order: string,
  initialDate: string,
  finalDate: string,
  method: string,
  entity: string,
  origin: string,
) {
  const params = {
    search,
    page,
    limit,
    column,
    order,
    initialDate,
    finalDate,
    method,
    entity,
    origin,
  };

  const resp = await api
    .get(`/system-logs`, {
      params,
    })
    .then((response) => {
      console.log('response: ', response);
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

export async function getLog(id: number) {
  const resp = await api.get(`/system-logs/${id}`);
  // .then((response) => {
  //   console.log("response: ", response);
  //   return response;
  // })
  // .catch((error) => {
  //   console.log("error: ", error);
  //   return {
  //     status: 400,
  //     data: {
  //       message: "Erro ao pesquisar log",
  //     },
  //   };
  // });
  return resp;
}

export type PaginationParams = {
  page: number;
  limit: number;
  search?: string;
  order: string;
  method?: string;
  column?: string;
  entity?: string;
  origin?: string;
  initialDate?: Date;
  finalDate?: Date;
  regionalPartnerId: number;
  city: string;
};

export async function getExportLog(params: PaginationParams) {
  return api.get(`/system-logs/reports/excel`, {
    params,
    responseType: 'blob',
  });
  // .then((response) => response.blob());
  // .then((response) => {
  //   console.log("response: ", response);
  //   return response;
  // })
  // .catch((error) => {
  //   console.log("error: ", error);
  //   return {
  //     status: 400,
  //     data: {
  //       message: "Erro ao pesquisar log",
  //     },
  //   };
  // });
  // return resp;
}
