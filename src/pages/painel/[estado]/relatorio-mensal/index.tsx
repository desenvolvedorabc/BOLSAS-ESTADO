import PageContainer from 'src/components/pageContainer';
import Top from 'src/components/top';
import Layout from 'src/components/layout';
import { ReactElement, useEffect, useState } from 'react';
import { withSSRAuth } from 'src/utils/withSSRAuth';
import {
  IGetWorkPlanActions,
  getWorkPlanActions,
} from 'src/services/plano-trabalho.service';
import FormCreateMonthReport from 'src/components/monthReport/FormCreteMonthReport';
import { getMyContract } from 'src/services/contract';

export enum Step {
  'create',
  'update',
  'send',
  'approve',
}
export default function PreencherRelatorioMensal() {
  const date = new Date();
  const [actions, setActions] = useState();
  const [month, setMonth] = useState(date.getMonth() + 1);
  const [year, setYear] = useState(date.getFullYear());
  const [isLoading, setIsLoading] = useState(true);
  const [term, setTerm] = useState(null);

  const load = async () => {
    const params: IGetWorkPlanActions = {
      limit: 999999,
      month: month,
      order: 'ASC',
      page: 1,
      search: null,
      status: null,
      year: year,
    };
    const resp = await getWorkPlanActions(params);

    const respTerm = await getMyContract();

    setTerm(respTerm.data?.termsOfMembership);

    setActions(resp.data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (month && year) load();
  }, [month, year]);

  return (
    <PageContainer>
      <Top title={'Relatório Mensal > Preencher Relatório'} />
      <FormCreateMonthReport
        actions={actions}
        loadedTerm={term}
        month={month}
        year={year}
      />
    </PageContainer>
  );
}

PreencherRelatorioMensal.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={'Relatório Mensal'}>{page}</Layout>;
};

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    return {
      props: {},
    };
  },
  {
    profiles: ['BOLSISTA'],
    roles: ['REL_MES'],
    // roles: [],
  },
);
