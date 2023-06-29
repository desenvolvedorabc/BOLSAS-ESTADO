import PageContainer from 'src/components/pageContainer';
import Top from 'src/components/top';
import Layout from 'src/components/layout';
import type { ReactElement } from 'react';
import { withSSRAuth } from 'src/utils/withSSRAuth';
import { TableAcceptScholarship } from 'src/components/acceptScholarship/TableAcceptScholarship';

export default function ApproveReports() {
  return (
    <PageContainer>
      <Top title={'Aprovação de Cadastro do Bolsista'} />
      <TableAcceptScholarship />
    </PageContainer>
  );
}

ApproveReports.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={'Aprovação de Cadastro do Bolsista'}>{page}</Layout>;
};

export const getServerSideProps = withSSRAuth(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (ctx) => {
    return {
      props: {},
    };
  },
  {
    roles: ['APRO_CAD_BOL'],
  },
);
