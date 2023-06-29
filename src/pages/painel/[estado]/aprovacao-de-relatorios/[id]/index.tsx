import PageContainer from 'src/components/pageContainer';
import Top from 'src/components/top';
import Layout from 'src/components/layout';
import { ReactElement, useEffect, useState } from 'react';
import { withSSRAuth } from 'src/utils/withSSRAuth';
import FormMonthReport from 'src/components/monthReport/FormMonthReport';
import { getMonthReport } from 'src/services/relatorio-mensal.service';

export default function AprovacaoRelatorio({ id, url }) {
  const [report, setReport] = useState();
  const [term, setTerm] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const loadMonthReport = async () => {
    const resp = await getMonthReport(id);
    setReport(resp.data?.monthlyReport);
    setTerm(resp.data?.termOfMembership);
    setIsLoading(false);
  };

  useEffect(() => {
    loadMonthReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageContainer>
      <Top title={'Aprovação de Relatórios > Ver Detalhes'} />
      {!isLoading && (
        <FormMonthReport
          loadedReport={report}
          loadedTerm={term}
          step={'approve'}
          url={url}
        />
      )}
    </PageContainer>
  );
}

AprovacaoRelatorio.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={'Aprovação de Relatórios'}>{page}</Layout>;
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
    roles: ['APRO_REL'],
  },
);
