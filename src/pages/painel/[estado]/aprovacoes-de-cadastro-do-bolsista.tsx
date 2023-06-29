import PageContainer from 'src/components/pageContainer';
import Top from 'src/components/top';
import Layout from 'src/components/layout';
import type { ReactElement } from 'react';
import { withSSRAuth } from 'src/utils/withSSRAuth';
import { TableAcceptScholarship } from 'src/components/acceptScholarship/TableAcceptScholarship';

export default function ApproveReports() {
  return (
    <PageContainer>
      <Top title={'Aprovação de Relatórios'} />
      <TableAcceptScholarship />
    </PageContainer>
  );
}

ApproveReports.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={'Aprovação de Relatórios'}>{page}</Layout>;
};

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    return {
      props: {},
    };
  },
  {
    roles: ['APRO_CAD_BOL'],
  },
);
