import PageContainer from 'src/components/pageContainer';
import Top from 'src/components/top';
import Layout from 'src/components/layout';
import type { ReactElement } from 'react';
import { withSSRAuth } from 'src/utils/withSSRAuth';
import FormCreateMessage from 'src/components/messages/formCreateMessage';

export default function NewMessage() {
  return (
    <PageContainer>
      <Top title={'Mensagens > Nova Mensagem'} />
      <FormCreateMessage />
    </PageContainer>
  );
}

NewMessage.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={'Mensagens'}>{page}</Layout>;
};

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    return {
      props: {},
    };
  },
  {
    roles: ['ENV_MEN'],
  },
);
