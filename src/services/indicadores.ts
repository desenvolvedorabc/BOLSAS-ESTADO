import { useQuery } from 'react-query';
import { api } from './api';

export type IGetIndicators = {
  year?: number;
  initialDate?: number;
  finalDate?: number;
  regionalPartnerId: number;
  cities: string[];
  month?: number;
  status?: string;
};

export function useGetMacroIndicators(enabled = true as boolean) {
  const { data, isLoading } = useQuery({
    queryKey: ['macro-indicators'],
    queryFn: async () => {
      const resp = await api
        .get(`/system-indicators/state/macro-indicators-general`)
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

export function useGetIndicatorsScholars(
  params: IGetIndicators,
  enabled = true as boolean,
) {
  const { data, isLoading } = useQuery({
    queryKey: ['indicators-scholars', params],
    queryFn: async () => {
      const resp = await api
        .get(`/system-indicators/state/scholars`, { params })
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

export function useGetIndicatorsValues(
  params: IGetIndicators,
  enabled = true as boolean,
) {
  const { data, isLoading } = useQuery({
    queryKey: ['average-value-terms', params],
    queryFn: async () => {
      const resp = await api
        .get(`/system-indicators/state/average-value-terms`, { params })
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

export function useGetIndicatorsReports(
  params: IGetIndicators,
  enabled = true as boolean,
) {
  const { data, isLoading } = useQuery({
    queryKey: ['indicators-month-reports', params],
    queryFn: async () => {
      const resp = await api
        .get(`/system-indicators/state/month-reports`, { params })
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

export function useGetIndicatorsScholarsPending(
  params: IGetIndicators,
  enabled = true as boolean,
) {
  const { data, isLoading } = useQuery({
    queryKey: ['indicators-scholars-pending', params],
    queryFn: async () => {
      const resp = await api
        .get(`/system-indicators/state/scholars-pending-shipment`, { params })
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

export function useGetIndicatorsPendingWorkPlan(
  params: IGetIndicators,
  enabled = true as boolean,
) {
  const { data, isLoading } = useQuery({
    queryKey: ['indicators-work-plan-pending', params],
    queryFn: async () => {
      const resp = await api
        .get(`/system-indicators/state/work-plans-pending-shipment`, { params })
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

export function useGetIndicatorsAmountInvested(
  params: IGetIndicators,
  enabled = true as boolean,
) {
  const { data, isLoading } = useQuery({
    queryKey: ['amount-invested-in-scholarship', params],
    queryFn: async () => {
      const resp = await api
        .get(`/system-indicators/state/amount-invested-in-scholarship`, {
          params,
        })
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

export function useGetIndicatorsTeachers(
  params: IGetIndicators,
  enabled = true as boolean,
) {
  const { data, isLoading } = useQuery({
    queryKey: ['indicators-trained-teachers', params],
    queryFn: async () => {
      const resp = await api
        .get(`/system-indicators/state/trained-teachers`, {
          params,
        })
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
