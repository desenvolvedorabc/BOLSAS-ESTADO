import PageContainer from 'src/components/pageContainer';
import Top from 'src/components/top';
import Layout from 'src/components/layout';
import { ReactElement, useEffect, useState } from 'react';
import { withSSRAuth } from 'src/utils/withSSRAuth';
import FormSystemParameters from 'src/components/systemParameters/FormSystemParameters';
import { getParamsMe } from 'src/services/params';

export default function ParametrosSistema() {
  const [systemParameter, setSystemParameter] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadParameters = async () => {
    const resp = await getParamsMe();

    if (resp?.data?.systemParameter) {
      setSystemParameter(resp.data?.systemParameter);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadParameters();
  }, []);

  return (
    <PageContainer>
      <Top title={'Parâmetros do Sistema'} />
      {!isLoading && <FormSystemParameters params={systemParameter} />}
    </PageContainer>
  );
}

ParametrosSistema.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={'Parâmetros do Sistema'}>{page}</Layout>;
};

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    return {
      props: {},
    };
  },
  {
    roles: ['PAR_ST'],
  },
);
