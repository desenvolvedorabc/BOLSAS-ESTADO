import PageContainer from 'src/components/pageContainer';
import Top from 'src/components/top';
import Layout from 'src/components/layout';
import { ReactElement, useEffect, useState } from 'react';
import FormWorkPlan from 'src/components/workPlan/FormWorkPlan';
import { getMyWorkPlan } from 'src/services/plano-trabalho.service';
import { withSSRAuth } from 'src/utils/withSSRAuth';
import { getMyContract } from 'src/services/contract';
import ModalConfirmacao from 'src/components/modalConfirmacao';
import Router from 'next/router';

export default function DetalhePlanoTrabalho() {
  const [plan, setPlan] = useState();
  const [term, setTerm] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  const [send, setSend] = useState(false);
  const [reload, setReload] = useState(false);
  const [modalShowTerm, setModalShowTerm] = useState(false);

  const loadWorkPlan = async () => {
    const resp = await getMyWorkPlan();
    if (resp.data.message) {
      setEdit(true);
    } else {
      setPlan(resp.data);
    }

    const respTerm = await getMyContract();

    if (respTerm.data?.termsOfMembership) {
      setTerm(respTerm?.data?.termsOfMembership);
    } else {
      setModalShowTerm(true);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadWorkPlan();
  }, [reload]);

  const handleChangeReload = () => {
    setReload(!reload);
  };

  return (
    <>
      <PageContainer>
        <Top title={'Plano de Trabalho'} />
        {!isLoading && (
          <FormWorkPlan
            loadedPlan={plan}
            loadedTerm={term}
            edit={edit}
            changeEdit={setEdit}
            reload={handleChangeReload}
            send={send}
            changeSend={setSend}
            approve={false}
          />
        )}
      </PageContainer>
      <ModalConfirmacao
        show={modalShowTerm}
        onHide={() => {
          Router.back();
        }}
        status={false}
        text={'Você não possui um termo de compromisso assinado'}
      />
    </>
  );
}

DetalhePlanoTrabalho.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={'Plano de Trabalho'}>{page}</Layout>;
};

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    return {
      props: {},
    };
  },
  {
    profiles: ['BOLSISTA'],
    roles: ['PLN_TRAB'],
  },
);
