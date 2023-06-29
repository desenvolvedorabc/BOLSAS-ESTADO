import { useQuery } from 'react-query';
import { api } from './api';

export type IDownloadRemittance = {
  regionalPartnerId: number;
  month: number;
  year: number;
};

export type IGetBank = {
  search: string;
  page: number;
  limit: number;
  order: string;
  year: number;
  month: number;
  regionalPartnerId: number;
};

export function useGetBankRemittances(
  params: IGetBank,
  enabled = true as boolean,
) {
  const { data, isLoading } = useQuery({
    queryKey: ['bank', params],
    queryFn: async () => {
      const resp = await api
        .get(`/bank-remittances/report-by-region`, {
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

export async function getBankRemittances(
  search: string,
  page: number,
  limit: number,
  order: string,
  year: string,
  month: string,
  regional: string,
) {
  const params = { search, page, limit, order, year, month, regional };
  // const resp = await axios.get("/api/partner-states", { params });
  const resp = await api
    .get(`${process.env.NEXT_PUBLIC_API_URL}/partner-states`, {
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

export async function getBankRemittancesApproved(params: IDownloadRemittance) {
  return api.get(`/bank-remittances/approved`, {
    params,
    responseType: 'blob',
  });
  // return resp;
}

export async function getBankRemittancesReproved(params: IDownloadRemittance) {
  return api.get(`/bank-remittances/reproved`, {
    params,
    responseType: 'blob',
  });
  // return resp;
}

export async function getBankRemittancesNoValidation(
  params: IDownloadRemittance,
) {
  return api.get(`/bank-remittances/no-validation`, {
    params,
    responseType: 'blob',
  });
  // return resp;
}

export async function getAnnualShipmentForScholar() {
  return api.get(`/bank-remittances/annual-shipment-for-scholar`, {
    responseType: 'blob',
  });
  // return resp;
}
