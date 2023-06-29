import TopHome from 'src/components/homeComponents/topHome';
import SessionTimeout from 'src/components/timeOut/sessionTimeout';
import Router, { useRouter } from 'next/router';
import { useState } from 'react';
import PageContainer from 'src/components/pageContainer';
import { destroyCookies } from 'src/utils/auth';
import Layout from 'src/components/layout';
import type { ReactElement } from 'react';
import { withSSRAuth } from 'src/utils/withSSRAuth';
import { Indicators } from 'src/components/homeComponents/indicators';
import { Card } from 'src/shared/styledForms';
import { SelectGraph } from 'src/components/homeComponents/selectGraph';
import { useAuth } from 'src/context/AuthContext';

export default function Home() {
  const [isAuthenticated, setAuth] = useState(true);
  const { query } = useRouter();
  const { user } = useAuth();

  const handleClick = () => {
    setAuth(!isAuthenticated);
    destroyCookies();
    Router.push(`/painel/${query?.estado}/login`);
  };

  return (
    <>
      <SessionTimeout logOut={handleClick} />
      <PageContainer>
        <TopHome title={'Home'} searchOpen={true} />
        {(user?.subRole === 'ADMIN' ||
          (user?.access_profile?.role &&
            user?.access_profile?.role !== 'BOLSISTA')) && (
          <>
            <Indicators />
            <Card style={{ marginTop: 30 }}>
              <SelectGraph />
            </Card>
          </>
        )}
      </PageContainer>
    </>
  );
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={'Home'}>{page}</Layout>;
};

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    return {
      props: {},
    };
  },
  {
    profiles: [],
    roles: [],
  },
);
