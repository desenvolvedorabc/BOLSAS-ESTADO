import PageContainer from 'src/components/pageContainer';
import Top from 'src/components/top';
import Layout from 'src/components/layout';
import type { ReactElement } from 'react';
import { withSSRAuth } from 'src/utils/withSSRAuth';
import { TableWorkPlan } from 'src/components/workPlan/TableWorkPlan';

export default function ApproveWorkPlans() {
  return (
    <PageContainer>
      <Top title={'Aprovações Planos de Trabalho'} />
      <TableWorkPlan />
    </PageContainer>
  );
}

ApproveWorkPlans.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={'Aprovações Planos de Trabalho'}>{page}</Layout>;
};

export const getServerSideProps = withSSRAuth(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (ctx) => {
    return {
      props: {},
    };
  },
  {
    roles: ['APRO_PLN_TRAB'],
  },
);
