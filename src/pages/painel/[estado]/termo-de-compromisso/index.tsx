import PageContainer from 'src/components/pageContainer';
import Top from 'src/components/top';
import Layout from 'src/components/layout';
import type { ReactElement } from 'react';
import { withSSRAuth } from 'src/utils/withSSRAuth';
import { TableContractAdhesion } from 'src/components/contractAdhesion/TableContractAdhesion';

export default function ContractAdhesion() {
  return (
    <PageContainer>
      <Top title={'Termo de Compromisso'} />
      <TableContractAdhesion url={null} />
    </PageContainer>
  );
}

ContractAdhesion.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={'Termo de Compromisso'}>{page}</Layout>;
};

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    return {
      props: {},
    };
  },
  {
    roles: ['TER_ADS'],
  },
);
