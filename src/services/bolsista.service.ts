/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from 'react-query';
import { api } from './api';
import { getBase64 } from 'src/utils/get-base64';

export type IPreScholarshipForm = {
  name: string;
  email: string;
  telephone: string;
  cpf: string;
  axle: string;
  idPartnerState?: number;
  city?: string;
  idRegional?: number;
  isFormer?: boolean;
};

export type IScholarshipForm = {
  rg: string;
  sex: string;
  axle: string;
  maritalStatus: string;
  dateOfBirth: Date;
  motherName: string;
  fatherName: string;
  cep: string;
  state: string;
  city: string;
  address: string;
  bank: string;
  agency: string;
  accountNumber: string;
  accountType: string;
  trainingArea: string;
  highestDegree: string;
  employmentRelationship: string;
  instituteOfOrigin: string;
  functionalStatus: string;
  locationDevelopWorkPlan: string;
  bagDescription: string;
  agreementOfTheEducationNetwork: string;
};

export type IGetScholarship = {
  search: string;
  page: number;
  limit: number;
  order: string;
  status?: string;
  city?: string;
};

export type IGetScholarTerm = {
  search: string;
  page: number;
  limit: number;
  order: string;
  status?: string;
};

export type IEditScholar = {
  email: string;
  telephone: number;
  axle: number;
  idAccessProfile: number;
};

export async function getApproveScholarshipsQuery(
  params: IGetScholarship,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  const { data, headers } = await api.get('/scholars', {
    params: params,
  });
  return data;
}

export function useGetScholarshipGeneralSearch(
  params: IGetScholarship,
  enabled = true as boolean,
) {
  const { data, isLoading } = useQuery({
    queryKey: ['scholars-general', params],
    queryFn: async () => {
      const resp = await api
        .get(`/scholars/general-search`, { params })
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

// export async function getScholarshipsGeneralSearch(params: IGetScholarship) {
//   const resp = await axios
//     .get(`${process.env.NEXT_PUBLIC_API_URL}/users/general/search`, {
//       params,
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     })
//     .then((response) => {
//       return response;
//     })
//     .catch((error) => {
//       console.log('error: ', error);
//       return {
//         status: 400,
//         data: {
//           message: 'Erro ao pesquisar usuários',
//         },
//       };
//     });
//   return resp;
// }

export async function createPreScholarship(data: IPreScholarshipForm) {
  const response = await api
    .post(`/scholars`, data)
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
  return response;
}

export async function getScholarshipMe() {
  const resp = await api
    .get(`/scholars/me`)
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

export function useGetScholarship(id: number, enabled = true as boolean) {
  const { data, isLoading } = useQuery({
    queryKey: ['complete_scholarship', id],
    queryFn: async () => {
      const resp = await api
        .get(`/scholars/${id}`)
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
    },
    staleTime: 1000 * 60 * 5, // 5 minutes,
    enabled: enabled,
  });

  return {
    data,
    isLoading,
  };
}

export async function getScholarship(id: number) {
  const resp = await api
    .get(`/scholars/${id}`)
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

export async function getScholarWithUser(id: number) {
  // const resp = await axios
  const resp = await api
    .get(`/scholars/${id}/with-user`)
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

export async function createCompleteScholarship(data: FormData) {
  const response = await api
    .post(`/scholars/completed-registration`, data, {
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
        status: 400,
        data: {
          message: error.response.data.message,
        },
      };
    });
  return response;
}

export async function editCompleteScholarship(id: number, data: FormData) {
  const response = await api
    .put(`/scholars/${id}`, data, {
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
        status: 400,
        data: {
          message: error.response.data.message,
        },
      };
    });
  return response;
}

export async function sendCompleteScholarship() {
  const response = await api
    .patch(`/scholars/send-for-validation`)
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
  return response;
}

export async function updateCompleteScholarship(id) {
  const response = await api
    .patch(`/scholars/${id}/in-validation`)
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
  return response;
}

export async function approveCompleteScholarship(
  id: number,
  idAccessProfile: number,
) {
  const response = await api
    .patch(`/scholars/${id}/approve`, { idAccessProfile })
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
  return response;
}

export async function reproveCompleteScholarship(
  id: number,
  justification: string,
) {
  const response = await api
    .patch(`/scholars/${id}/reprove`, { justification })
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
  return response;
}

export async function getScholarshipTerm(params: IGetScholarTerm) {
  // const resp = await axios.get("/api/partner-states", { params });
  const resp = await api
    .get(`/scholars/terms-of-membership/all`, {
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
          message: error.response.data.message,
        },
      };
    });
  return resp?.data;
}

export function useGetScholarshipTerm(params: IGetScholarTerm) {
  const { data, isLoading } = useQuery({
    queryKey: ['scholars_term', params],
    queryFn: async () => {
      const resp = await api
        .get(`/scholars/terms-of-membership/all`, {
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
              message: error.response.data.message,
            },
          };
        });
      return resp;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes,
  });

  return {
    data,
    isLoading,
  };
}

export async function editScholarWithUser(
  id: number,
  userId: number,
  data: IEditScholar,
  avatar: any,
) {
  if (avatar) {
    const result = await getBase64(avatar);

    const response = await api.post(`/users/avatar/upload`, {
      id: userId,
      filename: avatar.name,
      base64: result,
    });
  }

  const responseUpdate = await api
    .put(`/scholars/${id}/with-user`, data)
    .then(async (response) => {
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
