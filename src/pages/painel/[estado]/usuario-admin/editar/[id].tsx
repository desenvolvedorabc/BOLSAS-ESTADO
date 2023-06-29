import PageContainer from 'src/components/pageContainer';
import Top from 'src/components/top';
import Layout from 'src/components/layout';
import { ReactElement, useEffect, useState } from 'react';
import { useGetUser } from 'src/services/usuarios.service';
import FormEditUsuario from 'src/components/usuario/formEditUsuario';
import { withSSRAuth } from 'src/utils/withSSRAuth';
import { getScholarWithUser } from 'src/services/bolsista.service';

export default function EditarUsuario({ id, url }) {
  const [scholar, setScholar] = useState(null);
  const [isLoadingInfos, setIsLoadingInfos] = useState(true);

  const { data: usuario, isLoading } = useGetUser(id, url);

  const loadScholar = async () => {
    const resp = await getScholarWithUser(usuario?.id);

    if (resp.data?.scholar) {
      setScholar(resp.data?.scholar);
    }
    setIsLoadingInfos(false);
  };

  useEffect(() => {
    if (usuario) {
      if (usuario?.subRole === 'BOLSISTA') {
        loadScholar();
      } else {
        setIsLoadingInfos(false);
      }
    }
  }, [usuario]);

  return (
    <PageContainer>
      <Top title={`Usuários Admin > Editar`} />
      {!isLoadingInfos && (
        <FormEditUsuario usuario={usuario} scholar={scholar} />
      )}
    </PageContainer>
  );
}

EditarUsuario.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={'Editar Usuário Admin'}>{page}</Layout>;
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
