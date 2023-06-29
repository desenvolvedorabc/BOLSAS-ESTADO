import PageContainer from 'src/components/pageContainer';
import Top from 'src/components/top';
import Layout from 'src/components/layout';
import { ReactElement, useEffect, useState } from 'react';
import { withSSRAuth } from 'src/utils/withSSRAuth';
import { getScholarship } from 'src/services/bolsista.service';
import FormScholarshipApprove from 'src/components/scholarshipRegistration/FormScholarshipApprove';
import { useAuth } from 'src/context/AuthContext';

export default function AprovacaoCadastroCompletoBolsista({ id, url }) {
  const [scholarship, setScholarship] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const loadScholarship = async () => {
    const resp = await getScholarship(id);
    setScholarship(resp.data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadScholarship();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageContainer>
      <Top title={'Aprovação de Cadastro do Bolsista > Detalhes do Bolsista'} />
      {!isLoading && (
        <FormScholarshipApprove
          scholarship={scholarship}
          user={user}
          url={url}
        />
      )}
    </PageContainer>
  );
}

AprovacaoCadastroCompletoBolsista.getLayout = function getLayout(
  page: ReactElement,
) {
  return <Layout header={'Aprovação de Cadastro do Bolsista'}>{page}</Layout>;
};

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    const { id } = ctx.params;

    return {
      props: {
        id,
        url: process.env.NEXT_PUBLIC_API_URL,
      },
    };
  },
  {
    roles: ['APRO_CAD_BOL'],
  },
);
