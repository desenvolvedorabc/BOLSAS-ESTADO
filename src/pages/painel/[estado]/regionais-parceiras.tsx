import PageContainer from 'src/components/pageContainer';
import Top from 'src/components/top';
import TableRegional from 'src/components/regional/TableRegional';
import Layout from 'src/components/layout';
import type { ReactElement } from 'react';
import { withSSRAuth } from 'src/utils/withSSRAuth';

export default function RegionalPartiners() {
  return (
    <PageContainer>
      <Top title={'Regionais Parceiras'} />
      <TableRegional />
    </PageContainer>
  );
}

RegionalPartiners.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={'Regionais Parceiras'}>{page}</Layout>;
};

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    return {
      props: {},
    };
  },
  {
    roles: ['REG_PAR'],
  },
);
