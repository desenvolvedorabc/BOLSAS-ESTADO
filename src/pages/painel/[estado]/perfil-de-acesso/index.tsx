import PageContainer from 'src/components/pageContainer';
import Top from 'src/components/top';
import Layout from 'src/components/layout';
import type { ReactElement } from 'react';
import FormEditPerfil from 'src/components/perfil/formEditPerfil';
import { withSSRAuth } from 'src/utils/withSSRAuth';

export default function AdicionarPerfil() {
  return (
    <PageContainer>
      <Top title={'Perfis de Acesso > Novo Perfil'} />
      <FormEditPerfil perfil={null} />
    </PageContainer>
  );
}

AdicionarPerfil.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={'Novo Perfil de Acesso'}>{page}</Layout>;
};

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    return {
      props: {},
    };
  },
  {
    roles: ['PER_ACE'],
  },
);
