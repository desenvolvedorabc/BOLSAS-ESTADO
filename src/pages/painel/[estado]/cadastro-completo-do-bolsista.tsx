import PageContainer from 'src/components/pageContainer';
import Top from 'src/components/top';
import Layout from 'src/components/layout';
import { ReactElement, useEffect, useState } from 'react';
import { withSSRAuth } from 'src/utils/withSSRAuth';
import FormScholarshipRegistration from 'src/components/scholarshipRegistration/FormScholarshipRegistration';
import { getScholarshipMe } from 'src/services/bolsista.service';
import { useAuth } from 'src/context/AuthContext';
import LoadingScreen from 'src/components/loadingPage';

export default function ScholarshipRegistration({ url }) {
  const [scholarship, setScholarship] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [edit, setEdit] = useState(true);
  const { user } = useAuth();

  const loadScholarshipMe = async () => {
    setIsLoading(true);
    const resp = await getScholarshipMe();

    setScholarship(resp?.data?.scholar);

    if (resp?.data?.scholar?.registrationLevel === 'CADASTRO_COMPLETO') {
      setEdit(false);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadScholarshipMe();
  }, []);

  return (
    <PageContainer>
      <Top title={'Formulário de Cadastro'} />
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <FormScholarshipRegistration
          scholarship={scholarship}
          user={user}
          edit={edit}
          changeEdit={setEdit}
          url={url}
        />
      )}
    </PageContainer>
  );
}

ScholarshipRegistration.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={'Formulário de Cadastro'}>{page}</Layout>;
};

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    return {
      props: {
        url: process.env.NEXT_PUBLIC_API_URL,
      },
    };
  },
  {
    roles: ['CAD_COM_BOL'],
  },
);
