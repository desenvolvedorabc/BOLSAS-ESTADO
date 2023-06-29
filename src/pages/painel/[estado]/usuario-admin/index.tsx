import PageContainer from 'src/components/pageContainer';
import Top from 'src/components/top';
import Layout from 'src/components/layout';
import type { ReactElement } from 'react';
import FormEditUsuario from 'src/components/usuario/formEditUsuario';
import { withSSRAuth } from 'src/utils/withSSRAuth';

export default function AdicionarUsuario() {
  return (
    <PageContainer>
      <Top title={'Usuários Admin > Novo Usuário'} />
      <FormEditUsuario usuario={null} scholar={null} />
    </PageContainer>
  );
}

AdicionarUsuario.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={'Novo Usuário'}>{page}</Layout>;
};

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    return {
      props: {},
    };
  },
  {
    roles: ['USU_ADM'],
  },
);
