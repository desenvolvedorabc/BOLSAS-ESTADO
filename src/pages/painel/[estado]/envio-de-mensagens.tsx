import PageContainer from 'src/components/pageContainer';
import Top from 'src/components/top';
import Layout from 'src/components/layout';
import { ReactElement } from 'react';
import { withSSRAuth } from 'src/utils/withSSRAuth';
import TableMessages from 'src/components/messages/tableMessages';

export default function Messages() {
  return (
    <PageContainer>
      <Top title={'Mensagens'} />
      <TableMessages />
    </PageContainer>
  );
}

Messages.getLayout = function getLayout(page: ReactElement) {
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
