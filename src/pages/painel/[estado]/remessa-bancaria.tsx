import PageContainer from 'src/components/pageContainer';
import Top from 'src/components/top';
import Layout from 'src/components/layout';
import type { ReactElement } from 'react';
import { withSSRAuth } from 'src/utils/withSSRAuth';
import TableBankRemittance from 'src/components/bankRemittance/tableBankRemittance';

export default function RemessaBancaria() {
  return (
    <PageContainer>
      <Top title={'Listagem de Remessa'} />
      <TableBankRemittance />
    </PageContainer>
  );
}

RemessaBancaria.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={'Listagem de Remessa'}>{page}</Layout>;
};

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    return {
      props: {},
    };
  },
  {
    roles: ['REM_BAN'],
  },
);
