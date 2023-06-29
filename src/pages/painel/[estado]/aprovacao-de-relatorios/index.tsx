import PageContainer from 'src/components/pageContainer';
import Top from 'src/components/top';
import Layout from 'src/components/layout';
import type { ReactElement } from 'react';
import { withSSRAuth } from 'src/utils/withSSRAuth';
import { TableAcceptReport } from 'src/components/acceptReport/TableAcceptReport';

export default function ApproveReports() {
  return (
    <PageContainer>
      <Top title={'Aprovação de Relatórios'} />
      <TableAcceptReport />
    </PageContainer>
  );
}

ApproveReports.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={'Aprovação de Relatórios'}>{page}</Layout>;
};

export const getServerSideProps = withSSRAuth(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (ctx) => {
    return {
      props: {},
    };
  },
  {
    roles: ['APRO_REL'],
  },
);
