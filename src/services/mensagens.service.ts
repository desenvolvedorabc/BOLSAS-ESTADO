/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from 'react-query';
import { api } from './api';

export type IMessages = {
  title: string;
  text: string;
  usersIds: number[];
};

export type IGetMessages = {
  search?: string;
  page: number;
  limit: number;
  order: string;
  status?: number;
  column?: string;
};

export function useGetMessages(
  params: IGetMessages,
  // enabled = true as boolean,
) {
  const { data, isLoading } = useQuery({
    queryKey: ['messages', params],
    queryFn: async () => {
      const resp = await api
        .get(`/messages`, {
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
    // enabled: enabled,
  });

  return {
    data,
    isLoading,
  };
}

// export async function getAllMessages() {
//   const resp = await api
//     .get('/message/all')
//     .then((response) => {
//       console.log('response: ', response);
//       return response;
//     })
//     .catch((error) => {
//       console.log('error: ', error);
//       return {
//         status: 401,
//         data: {
//           message: error.response.data.message,
//         },
//       };
//     });
//   console.log(resp);

//   return resp;
// }

export async function getMessages(
  search: string,
  page: number,
  limit: number,
  column: string,
  order: string,
) {
  const params = { search, page, limit, column, order };

  const resp = await api
    .get('/messages', { params })
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

export async function createMessage(data: IMessages) {
  const resp = await api
    .post('/messages', data)
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

export async function editMessage(id: string, data: any) {
  const resp = await api
    .put(`/message/edit/${id}`, { data })
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

export async function deleteMessage(id: string) {
  const resp = await api
    .delete(`/messages/${id}`)
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

export async function getMessage(id) {
  const resp = await api
    .get(`/message/${id}`)
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
