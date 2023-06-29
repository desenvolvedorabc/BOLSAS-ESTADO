import PageContainer from 'src/components/pageContainer';
import Top from 'src/components/top';
import Layout from 'src/components/layout';
import type { ReactElement } from 'react';
import { withSSRAuth } from 'src/utils/withSSRAuth';
import CardInfoMinhaConta from 'src/components/minhaConta/cardInfoMinhaConta';

export default function UsuarioDetalhe({ url }) {
  return (
    <PageContainer>
      <Top title={`Minha Conta`} />
      <CardInfoMinhaConta url={url} />
    </PageContainer>
  );
}

UsuarioDetalhe.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={'Minha Conta'}>{page}</Layout>;
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
    roles: [],
  },
);
