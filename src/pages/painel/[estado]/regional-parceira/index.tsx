import PageContainer from 'src/components/pageContainer';
import Top from 'src/components/top';
import Layout from 'src/components/layout';
import type { ReactElement } from 'react';
import FormEditRegional from 'src/components/regional/FormEditRegional';
import { withSSRAuth } from 'src/utils/withSSRAuth';

export default function AdicionarRegional() {
  return (
    <PageContainer>
      <Top title={'Regionais Parceiras > Nova Regional'} />
      <FormEditRegional regional={null} />
    </PageContainer>
  );
}

AdicionarRegional.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={'Nova Regional Parceira'}>{page}</Layout>;
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
