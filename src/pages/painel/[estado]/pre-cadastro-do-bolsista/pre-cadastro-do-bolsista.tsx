import PageContainer from 'src/components/pageContainer';
import Top from 'src/components/top';
import Layout from 'src/components/layout';
import type { ReactElement } from 'react';
import { withSSRAuth } from 'src/utils/withSSRAuth';
import { TableScholarshipPreRegistration } from 'src/components/scholarshipPreRegistration/TableScholarshipPreRegistration';

export default function ScholarshipPreRegistration() {
  return (
    <PageContainer>
      <Top title={'Pré-cadastro do Bolsista > Adicionar Novo Bolsista'} />
      <TableScholarshipPreRegistration />
    </PageContainer>
  );
}

ScholarshipPreRegistration.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={'Adicionar Novo Bolsista'}>{page}</Layout>;
};

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    return {
      props: {},
    };
  },
  {
    roles: ['PRE_CAD_BOL'],
  },
);
