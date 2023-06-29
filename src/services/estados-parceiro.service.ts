import { api } from './api';

export type IState = {
  id?: number;
  name: string;
  cod_ibge: string;
  abbreviation: string;
  active?: boolean;
  logo: string;
  color: string;
};

export async function getStates(
  search: string,
  page: number,
  limit: number,
  order: string,
  status: string,
) {
  const params = { search, page, limit, order, status };
  // const resp = await axios.get("/api/partner-states", { params });
  const resp = await api
    .get(`${process.env.NEXT_PUBLIC_API_URL}/partner-states`, {
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

export async function getState(id: number) {
  // return await api.get(`/api/partner-states/${id}?token=${token}`);
  const resp = await api.get(
    `${process.env.NEXT_PUBLIC_API_URL}/partner-states/${id}`,
  );
  return resp;
}

export async function resendEmailPassword(id: number) {
  const response = await api.post(`/api/partner-states/resendEmail/${id}`);
  return response;
}

export type PaginationParams = {
  search?: string;
  page: number;
  limit: number;
  order: string;
  status?: string;
  column?: string;
  profile?: string;
  role?: 'PARC' | 'ESTADO';
  partnerState?: number;
};

export async function getExportExcelPartnerState(params: PaginationParams) {
  return api.get(
    `${process.env.NEXT_PUBLIC_API_URL}/partner-states/reports/excel`,
    {
      params,
      responseType: 'blob',
    },
  );
}

export async function getStateSlug(state: string) {
  const resp = await api.get(
    `${process.env.NEXT_PUBLIC_API_URL}/partner-states/slug/${state}`,
  );
  return resp;
}
