import PageContainer from 'src/components/pageContainer';
import Top from 'src/components/top';
import FormEditPerfil from 'src/components/perfil/formEditPerfil';
import Layout from 'src/components/layout';
import type { ReactElement } from 'react';
import { useGetPerfil } from 'src/services/perfis.service';
import { withSSRAuth } from 'src/utils/withSSRAuth';

export default function EditarPerfil({ id }) {
  const { data: perfil, isLoading } = useGetPerfil(id);

  return (
    <PageContainer>
      <Top title={`Perfis de Acesso > Editar Perfil`} />
      {perfil && <FormEditPerfil perfil={perfil} />}
    </PageContainer>
  );
}

EditarPerfil.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={'Editar Perfil de Acesso'}>{page}</Layout>;
};

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    const { id } = ctx.params;

    return {
      props: {
        id,
      },
    };
  },
  {
    roles: ['PER_ACE'],
  },
);
