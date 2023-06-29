import PageContainer from 'src/components/pageContainer';
import Top from 'src/components/top';
import Layout from 'src/components/layout';
import { ReactElement, useEffect, useState } from 'react';
import { withSSRAuth } from 'src/utils/withSSRAuth';
import FormMonthReport from 'src/components/monthReport/FormMonthReport';
import { getMonthReport } from 'src/services/relatorio-mensal.service';

export enum Step {
  'create',
  'update',
  'send',
  'approve',
}
export default function DetalhesRelatorioMensal({ id, url }) {
  const [report, setReport] = useState();
  const [term, setTerm] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [step, setStep] = useState('send');

  const loadMonthReport = async () => {
    const resp = await getMonthReport(id);
    setReport(resp.data?.monthlyReport);
    setTerm(resp.data?.termOfMembership);
    setIsLoading(false);
  };

  useEffect(() => {
    loadMonthReport();
  }, []);

  const changeStep = (newStep) => {
    setStep(newStep);
  };

  return (
    <PageContainer>
      <Top title={'Relatórios Mensais > Ver Relatório'} />
      {!isLoading && (
        <FormMonthReport
          loadedReport={report}
          loadedTerm={term}
          step={step}
          reload={loadMonthReport}
          changeStep={changeStep}
          url={url}
        />
      )}
    </PageContainer>
  );
}

DetalhesRelatorioMensal.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={'Relatórios Mensais'}>{page}</Layout>;
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
    roles: ['REL_MES'],
    profiles: ['BOLSISTA'],
    // roles: [],
  },
);
