import PageContainer from 'src/components/pageContainer';
import Top from 'src/components/top';
import FormEditRegional from 'src/components/regional/FormEditRegional';
import Layout from 'src/components/layout';
import type { ReactElement } from 'react';
import { useGetRegional } from 'src/services/regionais.service';
import { withSSRAuth } from 'src/utils/withSSRAuth';

export default function EditarRegional({ id }) {
  const { data: regional, isLoading } = useGetRegional(id);

  return (
    <PageContainer>
      <Top title={`Regionais Parceiras > Editar Regional`} />
      {regional && <FormEditRegional regional={regional} />}
    </PageContainer>
  );
}

EditarRegional.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={'Editar Regional de Acesso'}>{page}</Layout>;
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
    roles: ['REG_PAR'],
  },
);
