import PageContainer from 'src/components/pageContainer';
import Top from 'src/components/top';
import Layout from 'src/components/layout';
import { withSSRAuth } from 'src/utils/withSSRAuth';
import FormContractAdhesion from 'src/components/contractAdhesion/FormContractAdhesion';
import { ReactElement } from 'react';

export default function NewContractAdhesion() {
  return (
    <PageContainer>
      <Top title={'Termo de Compromisso > Novo Termo'} />
      <FormContractAdhesion contract={null} edit={true} changeEdit={null} />
    </PageContainer>
  );
}

NewContractAdhesion.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={'Novo Termo'}>{page}</Layout>;
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
