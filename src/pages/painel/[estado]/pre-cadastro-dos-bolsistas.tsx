import PageContainer from 'src/components/pageContainer';
import Top from 'src/components/top';
import Layout from 'src/components/layout';
import type { ReactElement } from 'react';
import { withSSRAuth } from 'src/utils/withSSRAuth';
import FormScholarshipPreRegistration from 'src/components/scholarshipPreRegistration/FormScholarshipPreRegistration';

export default function ScholarshipsPreRegistrations() {
  return (
    <PageContainer>
      <Top title={'Pré-cadastro do Bolsista'} />
      <FormScholarshipPreRegistration />
    </PageContainer>
  );
}

ScholarshipsPreRegistrations.getLayout = function getLayout(
  page: ReactElement,
) {
  return <Layout header={'Pré-cadastro do Bolsista'}>{page}</Layout>;
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
