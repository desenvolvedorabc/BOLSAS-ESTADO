import PageContainer from 'src/components/pageContainer';
import Top from 'src/components/top';
import { useGetUser } from 'src/services/usuarios.service';
import CardInfoUsuarioRelatorio from 'src/components/usuario/cardInfoUsuarioRelatorio';
import Layout from 'src/components/layout';
import type { ReactElement } from 'react';
import { withSSRAuth } from 'src/utils/withSSRAuth';

export default function UsuarioDetalhe({ id, url }) {
  const { data: usuario, isLoading } = useGetUser(id, url);

  return (
    <PageContainer>
      <Top title={`Usuários Admin > Perfil`} />
      {isLoading ? (
        <div className="d-flex align-items-center flex-column mt-5">
          <div className="spinner-border" role="status"></div>
        </div>
      ) : (
        <CardInfoUsuarioRelatorio usuario={usuario} />
      )}
    </PageContainer>
  );
}

UsuarioDetalhe.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={'Usuários Admin'}>{page}</Layout>;
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
    roles: ['USU_ADM'],
  },
);
