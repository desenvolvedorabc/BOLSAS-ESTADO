import PageContainer from 'src/components/pageContainer';
import Top from 'src/components/top';
import Layout from 'src/components/layout';
import type { ReactElement } from 'react';
import { withSSRAuth } from 'src/utils/withSSRAuth';
import { TableUsersStates } from 'src/components/usuario/TableUsersState';

export default function UsuariosAdmin({ url }) {
  return (
    <PageContainer>
      <Top title={'Usuários Admin'} />
      <TableUsersStates url={url} />
    </PageContainer>
  );
}

UsuariosAdmin.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={'Usuários Admin'}>{page}</Layout>;
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
    roles: ['USU_ADM'],
  },
);
