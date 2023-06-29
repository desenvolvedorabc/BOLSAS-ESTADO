import PageContainer from 'src/components/pageContainer';
import Top from 'src/components/top';
import Layout from 'src/components/layout';
import type { ReactElement } from 'react';
import { withSSRAuth } from 'src/utils/withSSRAuth';
import { TableMonthReport } from 'src/components/monthReport/TableMonthReport';
import { queryClient } from 'src/lib/react-query';

export default function MonthReports() {
  queryClient.invalidateQueries(['monthly_reports_me']);

  return (
    <PageContainer>
      <Top title={'Relatórios Mensais'} />
      <TableMonthReport />
    </PageContainer>
  );
}

MonthReports.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={'Relatórios Mensais'}>{page}</Layout>;
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
  },
);
