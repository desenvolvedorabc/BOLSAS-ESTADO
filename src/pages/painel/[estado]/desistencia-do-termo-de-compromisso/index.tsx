import PageContainer from 'src/components/pageContainer';
import Top from 'src/components/top';
import Layout from 'src/components/layout';
import { ReactElement, useEffect, useState } from 'react';
import { withSSRAuth } from 'src/utils/withSSRAuth';
import { getMyContract } from 'src/services/contract';
import Router from 'next/router';
import ModalInformacao from 'src/components/modalInformacao';
import CancelContractAdhesion from 'src/components/contractAdhesion/CancelContractAdhesion';

export default function CancelAdhesionContract({ url }) {
  const [contract, setContract] = useState(null);
  const [showModalError, setShowModalError] = useState(false);
  const [messageModalError, setMessageModalError] = useState(false);

  const loadContract = async () => {
    const resp = await getMyContract();
    if (resp.data?.termsOfMembership) setContract(resp.data?.termsOfMembership);
    else {
      setShowModalError(true);
      setMessageModalError(resp.data?.message);
    }
  };

  useEffect(() => {
    loadContract();
  }, []);

  return (
    <PageContainer>
      <Top title={`Desistência do Termo de Compromisso`} />
      {contract && <CancelContractAdhesion contract={contract} url={url} />}
      <ModalInformacao
        show={showModalError}
        onHide={() => {
          setShowModalError(false), Router.back();
        }}
        text={messageModalError}
        status={false}
      />
    </PageContainer>
  );
}

CancelAdhesionContract.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={'Desistência do Termo de Compromisso'}>{page}</Layout>;
};

export const getServerSideProps = withSSRAuth(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (ctx) => {
    return {
      props: {
        url: process.env.NEXT_PUBLIC_API_URL,
      },
    };
  },
  {
    roles: ['DES_ADS'],
  },
);
