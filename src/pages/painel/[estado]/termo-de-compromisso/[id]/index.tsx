import PageContainer from 'src/components/pageContainer';
import Top from 'src/components/top';
import Layout from 'src/components/layout';
import { withSSRAuth } from 'src/utils/withSSRAuth';
import FormContractAdhesion from 'src/components/contractAdhesion/FormContractAdhesion';
import { getContract } from 'src/services/contract';
import { ReactElement, useEffect, useState } from 'react';

export default function ContractAdhesionDetail({ id }) {
  const [isEdit, setIsEdit] = useState(false);
  const [contract, setContract] = useState(null);

  const loadContract = async () => {
    const resp = await getContract(id);
    if (resp.data?.termsOfMembership) setContract(resp.data?.termsOfMembership);
  };

  useEffect(() => {
    loadContract();
  }, []);

  const changeEdit = () => {
    setIsEdit(true);
  };

  return (
    <PageContainer>
      <Top
        title={`Termo de Compromisso > ${isEdit ? 'Editar Termo' : 'Detalhes'}`}
      />
      {contract && (
        <FormContractAdhesion
          contract={contract}
          edit={isEdit}
          changeEdit={changeEdit}
        />
      )}
    </PageContainer>
  );
}

ContractAdhesionDetail.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={'Detalhes'}>{page}</Layout>;
};

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    const { id } = ctx.params;
    return {
      props: {
        id,
      },
    };
  },
  {
    roles: ['TER_ADS'],
  },
);
