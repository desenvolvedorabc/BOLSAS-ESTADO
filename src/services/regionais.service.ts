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

export type IGetRegional = {
  search?: string;
  page: number;
  limit: number;
  order: string;
  status?: number;
  column?: string;
};

export function useGetRegionais(
  params: IGetRegional,
  enabled = true as boolean,
) {
  const { data, isLoading } = useQuery({
    queryKey: ['regional-partners', params],
    queryFn: async () => {
      const resp = await api
        .get(`/regional-partners`, {
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

export async function getRegionais(params: IGetRegional) {
  const resp = await api
    .get(`/regional-partners`, {
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

export async function createRegional(data: IRegional) {
  const response = await api
    .post(`${process.env.NEXT_PUBLIC_API_URL}/regional-partners`, data)
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

export async function editRegional(id: number, data: IRegional) {
  return api
    .put(`${process.env.NEXT_PUBLIC_API_URL}/regional-partners/${id}`, data)
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

export async function getRegional(id: number) {
  return api
    .get(`/regional-partners/${id}`)
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

export function useGetRegional(id) {
  const { data, isLoading } = useQuery({
    queryKey: ['regional-partner', id],
    queryFn: async () => {
      const response = await api
        .get(`/regional-partners/${id}`)
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

export async function getExportExcelRegional(params: IGetRegional) {
  return api.get(
    `${process.env.NEXT_PUBLIC_API_URL}/regional-partners/report/excel`,
    {
      params,
      responseType: 'blob',
    },
  );
}
