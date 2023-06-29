import PageContainer from 'src/components/pageContainer';
import Top from 'src/components/top';
import Layout from 'src/components/layout';
import { ReactElement, useEffect, useState } from 'react';
import FormWorkPlan from 'src/components/workPlan/FormWorkPlan';
import { getWorkPlan } from 'src/services/plano-trabalho.service';
import { withSSRAuth } from 'src/utils/withSSRAuth';

export default function AprovacaoPlanoTrabalho({ idPlano }) {
  const [plan, setPlan] = useState();
  const [term, setTerm] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  const [send, setSend] = useState(false);
  const [reload, setReload] = useState(false);

  const loadWorkPlan = async () => {
    const resp = await getWorkPlan(idPlano);
    setPlan(resp.data?.workPlan);
    setTerm(resp.data?.termOfMembership);
    setIsLoading(false);
  };

  useEffect(() => {
    loadWorkPlan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload]);

  const handleChangeReload = () => {
    setReload(!reload);
  };

  return (
    <PageContainer>
      <Top title={'Aprovação de Plano de Trabalho'} />
      {!isLoading && (
        <FormWorkPlan
          loadedPlan={plan}
          loadedTerm={term}
          edit={edit}
          changeEdit={setEdit}
          reload={handleChangeReload}
          send={send}
          changeSend={setSend}
          approve={true}
        />
      )}
    </PageContainer>
  );
}

AprovacaoPlanoTrabalho.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={'Aprovação de Plano de Trabalho'}>{page}</Layout>;
};

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    const { idPlano } = ctx.params;

    return {
      props: {
        idPlano,
      },
    };
  },
  {
    roles: ['APRO_PLN_TRAB'],
  },
);
