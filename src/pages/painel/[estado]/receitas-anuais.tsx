import PageContainer from 'src/components/pageContainer';
import Top from 'src/components/top';
import Layout from 'src/components/layout';
import { ReactElement, useState } from 'react';
import { withSSRAuth } from 'src/utils/withSSRAuth';
import { Card } from 'src/shared/styledForms';
import { ButtonDefault } from 'src/components/buttons/buttonDefault';
import { saveAs } from 'file-saver';
import { getAnnualShipmentForScholar } from 'src/services/bank';

export default function AnnualRevenue() {
  const [isDisabled, setIsDisabled] = useState(false);

  const handleDownload = async () => {
    setIsDisabled(true);

    let response;

    try {
      response = await getAnnualShipmentForScholar();

      saveAs(response?.data, 'Receita Anual');
    } catch (err) {
      setIsDisabled(false);
    } finally {
      setIsDisabled(false);
    }
  };

  return (
    <PageContainer>
      <Top title={'Receitas Anuais'} />
      <Card>
        <div>
          <strong>Emitir Remessa</strong>
        </div>
        <div style={{ width: 181, marginTop: 25 }}>
          <ButtonDefault
            onClick={() => handleDownload()}
            type="button"
            disable={isDisabled}
          >
            Exportar em Excel
          </ButtonDefault>
        </div>
      </Card>
    </PageContainer>
  );
}

AnnualRevenue.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={'Receitas Anuais'}>{page}</Layout>;
};

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    return {
      props: {},
    };
  },
  {
    roles: ['REC_ANO'],
  },
);
