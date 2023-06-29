import PageContainer from 'src/components/pageContainer';
import Top from 'src/components/top';
import Layout from 'src/components/layout';
import { ReactElement, useEffect, useState } from 'react';
import { withSSRAuth } from 'src/utils/withSSRAuth';
import { getMyContract } from 'src/services/contract';
import SignContractAdhesion from 'src/components/contractAdhesion/SignContractAdhesion';
import Router from 'next/router';
import ModalInformacao from 'src/components/modalInformacao';

export default function SignAdhesionContract({ url }) {
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
      <Top title={`Assinatura do Termo de Compromisso`} />
      {contract && <SignContractAdhesion contract={contract} url={url} />}
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

SignAdhesionContract.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={'Assinatura do Termo de Compromisso'}>{page}</Layout>;
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
    roles: ['ASS_ADS'],
  },
);
